package io.tbd.tbdex.pfi_mock_impl.circle;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import io.tbd.tbdex.pfi_mock_impl.circle.pojos.*;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;

public class CircleClient {
  // This is the test wallet ID for Circle. Hard coded for now.
  // Funds can not be moved directly to an external address so this will be a middle ground.
  // TODO: find more elegant solution
  private static final OkHttpClient http = new OkHttpClient();
  private static final Gson gson = new GsonBuilder().create();

  private static final String PROD_URL = "https://api.circle.com/v1/";
  private static final String SANDBOX_URL = "https://api-sandbox.circle.com/v1";

  private final static Request.Builder requestBuilder = new Request.Builder()
     .addHeader("Accept", "application/json")
     .addHeader("Content-Type", "application/json");

  private final String apiUrl;
  private final Source hostedWallet;

  public CircleClient(String hostedWalletId, String apiKey, Boolean useSandbox) {
    this.apiUrl = useSandbox ? SANDBOX_URL : PROD_URL;
    this.hostedWallet = new Source(hostedWalletId, "wallet");

    requestBuilder.addHeader("Authorization", "Bearer " + apiKey);
  }

  public BankAccount createBankAccount(CreateBankAccountRequest createBankAccountRequest)
      throws Exception {
    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson
        .toJson(createBankAccountRequest));

    Request request = requestBuilder
        .url(this.apiUrl + "/businessAccount/banks/wires")
        .post(body)
        .build();

    Response response = http.newCall(request).execute();
    JSONObject data = new JSONObject(response.body().string()).getJSONObject("data");

    return new BankAccount(data.getString("trackingRef"), data.getString("id"));
  }

  public void createWirePayment(CreateWirePaymentRequest createWirePaymentRequest)
      throws Exception {

    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(createWirePaymentRequest));

    Request request = requestBuilder
        .url(this.apiUrl + "/mocks/payments/wire")
        .post(body)
        .build();

    http.newCall(request).execute();
  }

  public void transfer(TransferRequest transferRequest) throws Exception {
    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(transferRequest));

    Request request = requestBuilder
        .url(this.apiUrl + "/transfers")
        .post(body)
        .build();

    http.newCall(request).execute();
  }

  public void payout(PayoutRequest payoutRequest) throws Exception {
    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(payoutRequest));

    Request request = requestBuilder
        .url(this.apiUrl + "/payouts")
        .post(body)
        .build();

    Response response = http.newCall(request).execute();

    System.out.println(response.body().string());
  }
}
