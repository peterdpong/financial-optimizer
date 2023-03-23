import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  HStack,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  useDisclosure,
} from "@chakra-ui/react";

import ProtectedRoute from "../../../src/auth/ProtectedRoute";
import Sidebar from "../../../components/app/Sidebar";
import { useAuth } from "../../../src/auth/auth";
import { deleteAccount } from "../../../src/firebase/UserActions";
import { Timestamp } from "firebase/firestore";
import LoanAccountModal from "../../../components/modals/AccountModals/LoanAccountModal";
import BankInvestmentAccountModal from "../../../components/modals/AccountModals/BankInvestmentAccountModal";
import CreditCardModal from "../../../components/modals/AccountModals/CreditCardModal";
import FixedInvestmentsModal from "../../../components/modals/AccountModals/FixedInvestmentsModal";
import OtherAssetsModal from "../../../components/modals/AccountModals/OtherAssetsModal";
import { BudgetEngineUtils } from "../../../src/engine/BudgetEngineUtils";
import Link from "next/link";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { buildDebtPayoffGraph } from "../../../src/visualization/BudgetVisualizationsHelpers";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function AccountsPage() {
  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  // const [extraMonthlyPayement, setExtraMonthlyPayement] = useState<string>("5");
  let paymentSchedule = undefined;
  if (userData)
    paymentSchedule = BudgetEngineUtils.loanPaymentSchedule(userData);

  const bankInvestmentAccountModalProps = useDisclosure();
  const creditCardModalProps = useDisclosure();
  const fixedInvestmentsModalProps = useDisclosure();
  const loanAccountModalProps = useDisclosure();
  const otherAssetsModalProps = useDisclosure();
  return (
    <ProtectedRoute>
      <Sidebar>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <HStack justifyContent="space-between">
            <Heading size="lg" mr="2.5rem">
              Accounts
            </Heading>
            <HStack>
              <Button
                colorScheme={"green"}
                onClick={bankInvestmentAccountModalProps.onOpen}
                size="sm"
              >
                Add bank/investment account
              </Button>
              <Button
                colorScheme={"green"}
                onClick={fixedInvestmentsModalProps.onOpen}
                size="sm"
              >
                Add fixed term investment
              </Button>
              <Button
                colorScheme={"green"}
                onClick={otherAssetsModalProps.onOpen}
                size="sm"
              >
                Add other asset
              </Button>
              <Button
                colorScheme={"green"}
                onClick={creditCardModalProps.onOpen}
                size="sm"
              >
                Add credit card
              </Button>
              <Button
                colorScheme={"green"}
                onClick={loanAccountModalProps.onOpen}
                size="sm"
              >
                Add loan
              </Button>
            </HStack>
          </HStack>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"15px"}
          my={"2rem"}
        >
          <Heading size="md" mr="2.5rem">
            Current Total Net Worth
          </Heading>
          <Stat>
            <StatNumber fontSize="2xl">
              {userData
                ? `$${BudgetEngineUtils.calculateNetWorth(
                    userData.financialInfo.accounts
                  ).toFixed(2)}`
                : "Error"}
            </StatNumber>
          </Stat>
        </Box>

        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          >
            {userData &&
              Object.keys(userData.financialInfo.accounts.bankAccounts).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.bankAccounts[accountKey];
                  return (
                    <Link
                      href={`/app/accounts/${currAccount.name
                        .split(" ")
                        .join("-")}`}
                      key={accountKey}
                    >
                      <a>
                        <Card
                          bgColor={"white"}
                          justify="space-between"
                          height="100%"
                        >
                          <CardBody>
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Badge>{currAccount.type}</Badge>
                                <Heading size="sm" mt="6px">
                                  {currAccount.name}
                                </Heading>
                                <Stat>
                                  <StatLabel>Account Value</StatLabel>
                                  <StatNumber>${currAccount.value}</StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Account Interest Rate</StatLabel>
                                  <StatNumber>
                                    {currAccount.interestRate}%
                                  </StatNumber>
                                </Stat>
                              </Box>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "BankAccount",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </Flex>
                          </CardBody>
                        </Card>
                      </a>
                    </Link>
                  );
                }
              )}
            {userData &&
              Object.keys(userData.financialInfo.accounts.fixedInvestments).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.fixedInvestments[
                      accountKey
                    ];
                  return (
                    <Link
                      href={`/app/accounts/${currAccount.name
                        .split(" ")
                        .join("-")}`}
                      key={accountKey}
                    >
                      <a>
                        <Card
                          bgColor={"white"}
                          justify="space-between"
                          height="100%"
                        >
                          <CardBody>
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Badge>FIXED INVESTMENT</Badge>
                                <Heading size="sm" mt="6px">
                                  {currAccount.name}
                                </Heading>
                                <Stat>
                                  <StatLabel>Account Value</StatLabel>
                                  <Stat>
                                    <StatLabel>Start date</StatLabel>
                                    <StatLabel>
                                      {(currAccount.startDate as Timestamp)
                                        .toDate()
                                        .toISOString()
                                        .substring(0, 10)}
                                    </StatLabel>
                                  </Stat>
                                  <Stat>
                                    <StatLabel>Maturity date</StatLabel>
                                    <StatLabel>
                                      {(currAccount.maturityDate as Timestamp)
                                        .toDate()
                                        .toISOString()
                                        .substring(0, 10)}
                                    </StatLabel>
                                  </Stat>
                                  <Stat>
                                    <StatLabel>Starting value</StatLabel>
                                    <StatNumber>
                                      ${currAccount.startingValue}
                                    </StatNumber>
                                  </Stat>
                                  <Stat>
                                    <StatLabel>Interest rate</StatLabel>
                                    <StatNumber>
                                      {currAccount.interestRate}%
                                    </StatNumber>
                                  </Stat>
                                </Stat>
                              </Box>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "FixedInvestments",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </Flex>
                          </CardBody>
                        </Card>
                      </a>
                    </Link>
                  );
                }
              )}

            {userData &&
              userData.financialInfo.accounts.otherAssets &&
              Object.keys(userData.financialInfo.accounts.otherAssets).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.otherAssets[accountKey];
                  return (
                    <Link
                      href={`/app/accounts/${currAccount.name
                        .split(" ")
                        .join("-")}`}
                      key={accountKey}
                    >
                      <a>
                        <Card
                          bgColor={"white"}
                          justify="space-between"
                          height="100%"
                        >
                          <CardBody>
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Badge>OTHER ASSET</Badge>
                                <Heading size="sm" mt="6px">
                                  {currAccount.name}
                                </Heading>
                                <Stat>
                                  <StatLabel>Asset Value</StatLabel>
                                  <StatNumber>${currAccount.value}</StatNumber>
                                </Stat>
                              </Box>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "OtherAsset",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </Flex>
                          </CardBody>
                        </Card>
                      </a>
                    </Link>
                  );
                }
              )}

            {userData &&
              Object.keys(userData.financialInfo.accounts.creditCards).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.creditCards[accountKey];
                  return (
                    <Link
                      href={`/app/accounts/${currAccount.name
                        .split(" ")
                        .join("-")}`}
                      key={accountKey}
                    >
                      <a>
                        <Card
                          bgColor={"white"}
                          justify="space-between"
                          height="100%"
                        >
                          <CardBody>
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Badge>CREDIT CARD</Badge>
                                <Heading size="sm" mt="6px">
                                  {currAccount.name}
                                </Heading>
                                <Stat>
                                  <StatLabel>Amount Owed</StatLabel>
                                  <StatNumber>
                                    ${currAccount.amountOwned}
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Account Interest Rate</StatLabel>
                                  <StatNumber>
                                    {currAccount.interestRate}%
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Next payment due</StatLabel>
                                  <StatLabel>
                                    {(currAccount.nextPaymentDate as Timestamp)
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Next payment amount</StatLabel>
                                  <StatNumber>
                                    ${currAccount.nextPaymentAmount}
                                  </StatNumber>
                                </Stat>
                              </Box>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "CreditCard",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </Flex>
                          </CardBody>
                        </Card>
                      </a>
                    </Link>
                  );
                }
              )}

            {userData &&
              Object.keys(userData.financialInfo.accounts.loans).map(
                (accountKey) => {
                  const currAccount =
                    userData.financialInfo.accounts.loans[accountKey];
                  return (
                    <Link
                      href={`/app/accounts/${currAccount.name
                        .split(" ")
                        .join("-")}`}
                      key={accountKey}
                    >
                      <a>
                        <Card
                          bgColor={"white"}
                          justify="space-between"
                          height="100%"
                        >
                          <CardBody>
                            <Flex
                              height="100%"
                              direction="column"
                              justifyContent="space-between"
                            >
                              <Box>
                                <Badge>LOAN</Badge>
                                <Heading size="sm" mt="6px">
                                  {currAccount.name}
                                </Heading>
                                <Stat>
                                  <StatLabel>Account Value</StatLabel>
                                  <StatNumber>
                                    ${currAccount.remainingAmount}
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Interest Rate</StatLabel>
                                  <StatNumber>
                                    {currAccount.interestRate}%
                                  </StatNumber>
                                </Stat>
                                <Stat>
                                  <StatLabel>Next payment due</StatLabel>
                                  <StatLabel>
                                    {(currAccount.paymentDate as Timestamp)
                                      .toDate()
                                      .toISOString()
                                      .substring(0, 10)}
                                  </StatLabel>
                                </Stat>
                                <Stat>
                                  <StatLabel>Minimum Payment</StatLabel>
                                  <StatNumber>
                                    ${currAccount.minimumPayment}
                                  </StatNumber>
                                </Stat>
                              </Box>
                              <Button
                                onClick={() => {
                                  deleteAccount(
                                    userData.uid,
                                    userData.financialInfo.accounts,
                                    "Loan",
                                    accountKey
                                  );
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </Flex>
                          </CardBody>
                        </Card>
                      </a>
                    </Link>
                  );
                }
              )}
          </SimpleGrid>
        </Box>
        <Box
          bgColor="gray.100"
          padding="6"
          rounded={"5px"}
          border={"1px"}
          borderColor={"gray.300"}
          mx={"24px"}
          my={"2rem"}
        >
          <Heading size="md" my="1rem">
            Debt Repayment Analysis
          </Heading>
          <Stack>
            <Flex px={"2rem"} gap={"4rem"}>
              {/* <RadioGroup defaultValue="avalanche">
                <Stack>
                  <Heading size="sm">Repayment Type</Heading>
                  <Radio value="avalanche">
                    Avalanche: High Interest Rate First
                  </Radio>
                  <Radio value="snowball">
                    Snowball: Lowest Principal First
                  </Radio>
                </Stack>
              </RadioGroup> */}
              {/* <Stack>
                <Heading size="sm">Monthly Payment towards Debts</Heading>
                <NumberInput
                  min={0}
                  value={extraMonthlyPayement}
                  onChange={(val) => {
                    setExtraMonthlyPayement(val);
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Stack> */}
              <Card bg={"white"} align={"center"}>
                <CardHeader>
                  <Heading size="md">Minimum Payment Debt Payoff Date</Heading>
                </CardHeader>
                <CardBody>
                  <Heading size="md">
                    {userData &&
                      BudgetEngineUtils.loanMinimumDateToPayoff(
                        userData
                      ).toLocaleString("en-us", {
                        month: "short",
                        year: "numeric",
                      })}
                  </Heading>
                </CardBody>
              </Card>
              {/* <Card bg={"white"} align={"center"}>
                <CardHeader>
                  <Heading size="md">Projected Debt Payoff Date</Heading>
                </CardHeader>
                <CardBody>
                  <Heading size="md">July 2023</Heading>
                </CardBody>
              </Card> */}
              <Card bg={"white"} align={"center"}>
                <CardHeader>
                  <Heading size="md">Interest Paid</Heading>
                </CardHeader>
                <CardBody>
                  <Heading size="md">
                    $
                    {paymentSchedule &&
                      paymentSchedule
                        .reduce(
                          (total, account) =>
                            total +
                            account.reduce(
                              (innerTotal, entry) =>
                                innerTotal + entry.interest,
                              0
                            ),
                          0
                        )
                        .toFixed(2)}
                  </Heading>
                </CardBody>
              </Card>
            </Flex>
          </Stack>
          {userData && paymentSchedule ? (
            <Line data={buildDebtPayoffGraph(paymentSchedule, userData)} />
          ) : null}
        </Box>
      </Sidebar>

      <LoanAccountModal
        isOpen={loanAccountModalProps.isOpen}
        onClose={loanAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <BankInvestmentAccountModal
        isOpen={bankInvestmentAccountModalProps.isOpen}
        onClose={bankInvestmentAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <CreditCardModal
        isOpen={creditCardModalProps.isOpen}
        onClose={creditCardModalProps.onClose}
        uid={userData?.uid}
      />

      <FixedInvestmentsModal
        isOpen={fixedInvestmentsModalProps.isOpen}
        onClose={fixedInvestmentsModalProps.onClose}
        uid={userData?.uid}
      />

      <OtherAssetsModal
        isOpen={otherAssetsModalProps.isOpen}
        onClose={otherAssetsModalProps.onClose}
        uid={userData?.uid}
      />
    </ProtectedRoute>
  );
}
