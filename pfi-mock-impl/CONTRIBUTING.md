# Contribution Guide

There are many ways to be an open source contributor, and we're here to help you on your way! You may:

* Propose ideas in our [discussion forums](LINK_HERE)  ___***FIX LINK AND REMOVE THIS NOTICE***___
* Raise an issue or feature request in our [issue tracker](LINK_HERE)  ___***FIX LINK AND REMOVE THIS NOTICE***___
* Help another contributor with one of their questions, or a code review
* Suggest improvements to our Getting Started documentation by supplying a Pull Request
* Evangelize our work together in conferences, podcasts, and social media spaces.

This guide is for you.

NOTE: All commands are run in path `tbdex-protocol/pfi-mock-impl`

## Development Prerequisites

___***UPDATE TABLE OF PROJECT DEPS AND INSTALLATION NOTES***___

| Requirement    | Tested Version  | Installation Instructions                          |
|----------------|-----------------|----------------------------------------------------|
| docker-compose | 1.29.2          | Below, recommended via homebrew                    |
| Docker         | 20.10.11        | [Get Docker](https://docs.docker.com/get-docker/)  |
| Java           | 17.0.2          | Below, recommended via [SDKMan](https://sdkman.io) |

### docker-compose

This project uses docker-compose to spin up a mysql instance for testing and running locally

#### MacOS

```shell
xcode-select --install
```

##### Homebrew
```
$> brew install docker-compose
```

### Java

This project is written in Java, a typesafe, compiled programming language.

You may verify your `java` installation via the terminal by running `java -version`.

If you do not have Java, we recommend installing it
via [SDKMan](https://sdkman.io/install). This is a project which will allow you
to easily install the Java Development Kit (JDK), runtime (JRE), and related frameworks,
build tools, and runtimes.

After you've installed SDKMan, you may install Java:

#### SDKMan (cross-platform instructions)

```shell
$> sdk install java
 ...
Do you want java 17.0.2-open to be set as default? (Y/n): Y
Setting java 17.0.2-open as default.
```

You may test your installation:

```shell
$> java -version
openjdk version "17.0.2" 2022-01-18
OpenJDK Runtime Environment (build 17.0.2+8-86)
OpenJDK 64-Bit Server VM (build 17.0.2+8-86, mixed mode, sharing)
```

---
**NOTE**

You may additionally look for other Java versions to install by running `sdk list java`:

...or other installation candidates like Apache Ant, Apache Maven, etc, by running `sdk list`.

Consult the SDKMan documentation for more info.

---

## Build (Java / Gradle)

### macOS / Linux
```shell
$> ../gradlew :pfi-mock-impl:build
```

## Hello World (Java / Gradle)

### macOS / Linux

```shell
$> ../gradlew :pfi-mock-impl:run
```

```shell
$> curl http://localhost:9004/hello-world
```

## Example Message (Java / Gradle)

### macOS / Linux
This command will spin up mysql in a docker container with the appropriate migrations, make sure docker is up and running
```shell
$> make dev-up
```
#### Setup Database

access docker mysql container
```shell
$> docker exec -it mysql mysql -u root -ptbdev tbdex
```

create messages table
```
CREATE TABLE messages (
  id           BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  thread_token VARCHAR(20) NOT NULL,
  message      longtext NOT NULL,
  created_at   TIMESTAMP NULL,
  updated_at   TIMESTAMP NULL,
  KEY idx_thread_token(thread_token)
);
```

Start Application
```shell
$> ../gradlew :pfi-mock-impl:run
```
Sends an `ASK` to the application to process
```shell
$> curl \
--header "Content-type: application/json" \
--data-raw '{
    "id":"mid",
    "threadID":"thid1",
    "type":"Ask",
    "from":"pfi",
    "to":"alice",
    "body":{
      "sourceCurrency":"USD",
      "sourceAmount":100,
      "targetCurrency":"USDC",
      "type":"Ask",
      "validReplyTypes":["Close","ConditionalOffer"]
    }
  }' 'http://localhost:9004/handle-message'
```
Sends an `OfferAccept` to the application to process, please change 
the wallet_address and idempotency_key, make sure the threadID and 
thread_token match the one in the `ASK` request.

Also before making this call, please populate BEARER_KEY in RealCircleClient,
and WALLET_SOURCE in PaymentProcessor,
learn more about [Circle API](https://developers.circle.com/reference)
```shell
$> curl \
--header "Content-type: application/json" \
--data-raw '{
    "id":"mid",
    "threadID":"thid1",
    "type":"OfferAccept",
    "from":"alice",
    "to":"pfi",
    "body":{
      "paymentProcessorRequest": {
          "thread_token": "thid1",
          "idempotency_key": "ba943ff1-ca16-49b2-ba55-1057e70ca5c7",
             "account_number": "12340010",
             "routing_number": "121000248",
             "billing_details": {
                  "name": "Satoshi Nakamoto",
                  "city": "Boston",
                  "country": "US",
                  "line1": "100 Money Street",
                  "line2": "Suite 1",
                  "district": "MA",
                  "postalCode": "01234"
             },
          "bank_address": {
              "bankName": "SAN FRANCISCO",
              "city": "SAN FRANCISCO",
              "country": "US",
              "line1": "100 Money Street",
              "line2": "Suite 1",
              "district": "CA"
          },
          "wallet_address":"0x_YOUR_EVM_WALLET_ADDRESS"
      },
      "type":"OfferAccept",
      "validReplyTypes":["Close"]
    }
  }' 'http://localhost:9004/handle-message'
```

Add this [ERC20 token](https://etherscan.io/token/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48) address to your wallet,
and switch to ETH Goerli testnet to see the USDC

## Access Docker MySQL Database

```shell
$> docker exec -it mysql mysql -u root -ptbdev tbdex
```

## Test (Java / Gradle)

### macOS / Linux
This command will spin up mysql in a docker container with the appropriate migrations
```shell
$> make dev-up
```

```shell
$> ../gradlew :pfi-mock-impl:test
```

## Communications

### Issues

Anyone from the community is welcome (and encouraged!) to raise issues via [GitHub Issues](LINK_HERE)  ___***FIX LINK AND REMOVE THIS NOTICE***___.

### Discussions

Design discussions and proposals take place on [GitHub Discussions](LINK_HERE)  ___***FIX LINK AND REMOVE THIS NOTICE***___. 

We advocate an asynchronous, written debate model - so write up your thoughts and invite the community to join in!


 ___***FIX LINK ABOVE AND REMOVE THIS NOTICE***___

## Contribution

We review contributions to the codebase via GitHub's Pull Request mechanism. We have the following guidelines to ease your experience and help our leads respond quickly to your valuable work:

* Start by proposing a change either in Issues (most appropriate for small change requests or bug fixes) or in Discussions (most appropriate for design and architecture considerations, proposing a new feature, or where you'd like insight and feedback)
* Cultivate consensus around your ideas; the project leads will help you pre-flight how beneficial the proposal might be to the project. Developing early buy-in will help others understand what you're looking to do, and give you a a greater chance of your contributions making it into the codebase! No one wants to see work done in an area that's unlikely to be incorporated into the codebase.
* Fork the repo into your own namespace/remote
* Work in a dedicated feature branch. Atlassian wrote a great [description of this workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)
* When you're ready to offer your work to the project, first:
* Squash your commits into a single one (or an appropriate small number of commits), and rebase atop the upstream `main` branch. This will limit the potential for merge conflicts during review, and helps keep the audit trail clean. A good writeup for how this is done is [here](https://medium.com/@slamflipstrom/a-beginners-guide-to-squashing-commits-with-git-rebase-8185cf6e62ec), and if you're having trouble - feel free to ask a member or the community for help or leave the commits as-is, and flag that you'd like rebasing assistance in your PR! We're here to support you.
* Open a PR in the project to bring in the code from your feature branch.
* The maintainers noted in the `CODEOWNERS` file will review your PR and optionally open a discussion about its contents before moving forward.
* Remain responsive to follow-up questions, be open to making requested changes, and...
* You're a contributor!
* And remember to respect everyone in our global development community. Guidelines are established in our `CODE_OF_CONDUCT.md`.