package io.tbd.tbdex.pfi_mock_impl.payments;

import com.github.dockerjava.api.command.CreateContainerCmd;
import com.github.dockerjava.api.model.ExposedPort;
import com.github.dockerjava.api.model.PortBinding;
import com.github.dockerjava.api.model.Ports;
import com.google.gson.JsonElement;
import com.squareup.protos.tbd.pfi.PaymentProcessorRequest;
import io.tbd.tbdex.pfi_mock_impl.TestBase;
import io.tbd.tbdex.pfi_mock_impl.TestHelper;
import io.tbd.tbdex.pfi_mock_impl.store.HibernateUtil;
import io.tbd.tbdex.protocol.core.JsonParser;
import io.tbd.tbdex.protocol.core.Message;
import io.tbd.tbdex.protocol.core.MessageThreadStore;
import io.tbd.tbdex.protocol.messages.Ask;
import io.tbd.tbdex.protocol.messages.SettlementDetails;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testcontainers.containers.BindMode;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import javax.inject.Inject;
import java.math.BigDecimal;
import java.util.function.Consumer;

@Testcontainers
public class PaymentProcessorTest extends TestBase {
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    private @Inject MessageThreadStore threadStore;
    private @Inject PaymentProcessor paymentProcessor;

    private final int hostPort = HibernateUtil.DB_PORT;
    private final int containerExposedPort = HibernateUtil.MYSQL_DEFAULT_PORT;
    private final PortBinding staticBinding = new PortBinding(
            Ports.Binding.bindPort(hostPort),
            new ExposedPort(containerExposedPort)
    );
    private final Consumer<CreateContainerCmd> containerBinding = e -> e.withPortBindings(staticBinding);

    @Container
    private final GenericContainer<?> mysql = new MySQLContainer<>(DockerImageName.parse("mysql:5.7"))
            .withDatabaseName(HibernateUtil.DB_NAME)
            .withUsername(HibernateUtil.DB_USER)
            .withPassword(HibernateUtil.DB_PASS)
            .withCreateContainerCmdModifier(containerBinding)
            .withClasspathResourceMapping("migrations/", "/docker-entrypoint-initdb.d", BindMode.READ_WRITE)
            .withLogConsumer(new Slf4jLogConsumer(logger));

    @Test
    @DisplayName("runs without error")
    void happyPath() {
        logger.debug("MySql database container: {}", mysql.getContainerName());

        String threadToken = "thid";
        Message message1 = new Message.Builder("mid", threadToken, "pfi", "alice")
                .build(new Ask("USDC", BigDecimal.valueOf(100), "USDC"));
        threadStore.addMessageToThread(message1);

        PaymentProcessorRequest request = new PaymentProcessorRequest.Builder()
                .account_number(TestHelper.PAYMENT_INSTRUMENT.account_number)
                .routing_number(TestHelper.PAYMENT_INSTRUMENT.routing_number)
                .bank_address(TestHelper.BANK_ADDRESS)
                .billing_details(TestHelper.BILLING_DETAILS)
                .wallet_address("123")
                .email_address("123")
                .build();

        JsonElement body = JsonParser.getParser().toJsonTree(request);
        SettlementDetails settlementDetails = new SettlementDetails(body);

        paymentProcessor.process(settlementDetails, threadToken);
    }
}
