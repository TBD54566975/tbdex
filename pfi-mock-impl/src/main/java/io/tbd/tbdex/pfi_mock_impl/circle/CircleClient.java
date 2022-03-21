package io.tbd.tbdex.pfi_mock_impl.circle;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
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

    BankAccount bankAccount = new BankAccount();
    bankAccount.id = data.getString("id");
    bankAccount.trackingRef = data.getString("trackingRef");
    return bankAccount;
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

  static class BankAccount {
    String id;
    String trackingRef;
  }

  static class CreateBankAccountRequest {
    String accountNumber;
    String routingNumber;
    String idempotencyKey;
    BankAddress bankAddress;
    BillingDetails billingDetails;
  }

  static class BillingDetails {
    String name ;
    String city;
    String country;
    String line1;
    String postalCode;
    String district;
  }

  static class BankAddress {
    String country;
  }

  static class CreateWirePaymentRequest {
    Amount amount;
    String trackingRef;
  }

  static class Amount {
    String amount;
    CurrencyCode currency;
  }
  enum CurrencyCode {
    USD,
    USDC
  }

  static class PayoutRequest {
    Source source;
    Destination destination;
    Amount amount;
    Metadata metadata;
    String idempotencyKey;
  }

  static class TransferRequest {
    Source source;
    Destination destination;
    Amount amount;
    String idempotencyKey;
  }

  static class Source {
    String id;
    String type;
  }

  static class Destination {
    String id;
    String type;
    String address;
    String chain;
  }

  static class Metadata {
    String beneficiaryEmail;
  }
}
