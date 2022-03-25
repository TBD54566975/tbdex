package io.tbd.tbdex.pfi_mock_impl.circle;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.squareup.protos.tbd.pfi.BankAccount;
import com.squareup.protos.tbd.pfi.CreateBankAccountRequest;
import com.squareup.protos.tbd.pfi.CreateWirePaymentRequest;
import com.squareup.protos.tbd.pfi.PayoutRequest;
import com.squareup.protos.tbd.pfi.TransferRequest;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;

public class CircleClient {
  private static final Gson gson = new GsonBuilder()
      .create();
  private static final String BEARER_KEY = "";

  private final static Request.Builder requestBuilder = new Request.Builder()
      .addHeader("Accept", "application/json")
      .addHeader("Content-Type", "application/json")
      .addHeader("Authorization", "Bearer " + BEARER_KEY);

  public static BankAccount createBankAccount(CreateBankAccountRequest createBankAccountRequest)
      throws Exception {
    OkHttpClient client = new OkHttpClient();

    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson
        .toJson(createBankAccountRequest));

    Request request = requestBuilder
        .url("https://api-sandbox.circle.com/v1/banks/wires")
        .post(body)
        .build();

    Response response = client.newCall(request).execute();
    JSONObject data = new JSONObject(response.body().string()).getJSONObject("data");

    return new BankAccount.Builder()
        .trackingRef(data.getString("trackingRef"))
        .id(data.getString("id"))
        .build();
  }

  public static void createWirePayment(CreateWirePaymentRequest createWirePaymentRequest)
      throws Exception {
    OkHttpClient client = new OkHttpClient();

    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(createWirePaymentRequest));

    Request request = requestBuilder
        .url("https://api-sandbox.circle.com/v1/mocks/payments/wire")
        .post(body)
        .build();

    Response response = client.newCall(request).execute();

    System.out.println(response.body().string());
  }

  public static void transfer(TransferRequest transferRequest) throws Exception {
    OkHttpClient client = new OkHttpClient();

    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(transferRequest));

    Request request = requestBuilder
        .url("https://api-sandbox.circle.com/v1/transfers")
        .post(body)
        .build();

    Response response = client.newCall(request).execute();

    System.out.println(response.body().string());
  }

  public static void payout(PayoutRequest payoutRequest) throws Exception {
    OkHttpClient client = new OkHttpClient();

    MediaType mediaType = MediaType.parse("application/json");
    RequestBody body = RequestBody.create(mediaType, gson.toJson(payoutRequest));

    Request request = requestBuilder
        .url("https://api-sandbox.circle.com/v1/payouts")
        .post(body)
        .build();

    Response response = client.newCall(request).execute();

    System.out.println(response.body().string());
  }
}
