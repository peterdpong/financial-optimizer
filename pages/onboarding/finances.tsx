import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Formik } from "formik";
import { NumberInputControl, SubmitButton } from "formik-chakra-ui";
import { useRouter } from "next/router";
import BankAccountModal from "../../components/modals/AccountModals/BankAccountModal";
import AddAccountModal from "../../components/modals/AccountModals/BankAccountModal";
import CreditCardModal from "../../components/modals/AccountModals/CreditCardModal";
import FixedInvestmentsModal from "../../components/modals/AccountModals/FixedInvestmentsModal";
import LoanAccountModal from "../../components/modals/AccountModals/LoanAccountModal";
import RecurringExpenseModal from "../../components/modals/RecurringExpenseModal";
import { useAuth } from "../../src/auth/auth";
import ProtectedRoute from "../../src/auth/ProtectedRoute";
import {
  deleteAccount,
  deleteMonthlyTransaction,
  setMonthlyIncome,
} from "../../src/firebase/UserActions";

export default function FinancesPages() {
  const router = useRouter();

  const { useRequiredAuth } = useAuth();
  const userData = useRequiredAuth();

  const recurringExpensesModalProps = useDisclosure();
  const bankAccountModalProps = useDisclosure();
  const creditCardModalProps = useDisclosure();
  const fixedInvestmentsModalProps = useDisclosure();
  const loanAccountModalProps = useDisclosure();

  const onDeleteMonthlyTransaction = (index: number) => {
    if (userData) {
      deleteMonthlyTransaction(
        userData?.uid,
        userData?.financialInfo.monthlyTransactions,
        index
      );
    }
  };

  const onDeleteAccount = (index: number) => {
    if (userData) {
      deleteAccount(userData?.uid, userData?.financialInfo.accounts, index);
    }
  };

  return (
    <ProtectedRoute>
      <Container maxW="container.xl" my={"25px"}>
        <Button size="sm" onClick={() => router.push("/onboarding/")}>
          Back
        </Button>
        <Heading>Your Monthly Finances</Heading>
        <Text fontSize={"md"}>What do you finances look like?</Text>

        <Formik
          initialValues={{
            monthlyIncome: 2500,
          }}
          onSubmit={(values, actions) => {
            if (userData) {
              setMonthlyIncome(userData.uid, values.monthlyIncome);
              actions.resetForm;
              router.push("/onboarding/budget");
            } else {
              alert("Error: User not logged in...");
              router.push("/login");
            }
          }}
        >
          {({ handleSubmit, values }) => (
            <Container
              maxW="container.xl"
              as="form"
              p={"0px"}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onSubmit={handleSubmit as any}
            >
              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <Heading mb={"5px"} fontSize={"xl"}>
                  Monthly Income ($)
                </Heading>
                <NumberInputControl
                  name="monthlyIncome"
                  numberInputProps={{
                    min: 1,
                    max: 1000000000,
                    step: 50,
                    precision: 2,
                    value: values.monthlyIncome,
                  }}
                />
              </Box>

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <HStack justifyContent="space-between" my={2}>
                  <Heading fontSize={"xl"}>Reccurring Expenses</Heading>
                  <Button
                    colorScheme={"green"}
                    onClick={recurringExpensesModalProps.onOpen}
                    size="sm"
                  >
                    Add reccurring expenses
                  </Button>
                </HStack>

                {userData &&
                userData.financialInfo.monthlyTransactions.length === 0 ? (
                  <Center
                    onClick={recurringExpensesModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"100px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a recurring expenses
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  >
                    {userData?.financialInfo.monthlyTransactions.map(
                      (transaction, index) => {
                        return (
                          <Card
                            bgColor={"white"}
                            key={index}
                            justify="space-between"
                          >
                            <CardBody>
                              <Badge>{transaction.category}</Badge>
                              <Heading size="sm"> {transaction.name} </Heading>
                              <Stat>
                                <StatLabel>Expense per month</StatLabel>
                                <StatNumber>-${transaction.amount}</StatNumber>
                              </Stat>
                            </CardBody>
                            <CardFooter>
                              <Button
                                onClick={() => {
                                  onDeleteMonthlyTransaction(index);
                                }}
                                size="xs"
                                variant="link"
                              >
                                Delete
                              </Button>
                            </CardFooter>
                          </Card>
                        );
                      }
                    )}
                  </SimpleGrid>
                )}
              </Box>

              <Box
                bg={"gray.100"}
                rounded={"5px"}
                my={"25px"}
                p={"20px"}
                border={"1px"}
                borderColor={"gray.300"}
              >
                <HStack justifyContent="space-between" my={2}>
                  <Heading fontSize={"xl"}>Accounts</Heading>
                  <HStack>
                    <Button
                      colorScheme={"green"}
                      onClick={bankAccountModalProps.onOpen}
                      size="sm"
                    >
                      Add bank account
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
                    <Button
                      colorScheme={"green"}
                      onClick={fixedInvestmentsModalProps.onOpen}
                      size="sm"
                    >
                      Add fixed investment
                    </Button>
                  </HStack>
                </HStack>

                {userData && userData.financialInfo.accounts.length === 0 ? (
                  <Center
                    onClick={accountsModalProps.onOpen}
                    bg={"gray.50"}
                    width={"200px"}
                    height={"200px"}
                    rounded={"5px"}
                    my={"25px"}
                    p={"20px"}
                    border={"1px"}
                    borderStyle={"dashed"}
                    borderColor={"gray.300"}
                  >
                    <Text color={"gray.800"} align={"center"}>
                      Add a financial accounts
                    </Text>
                  </Center>
                ) : (
                  <SimpleGrid
                    spacing={4}
                    templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  >
                    {userData?.financialInfo.accounts.map((account, index) => {
                      return (
                        <Card
                          bgColor={"white"}
                          key={index}
                          justify="space-between"
                        >
                          <CardBody>
                            <Badge>{account.type}</Badge>
                            <Heading size="sm"> {account.name} </Heading>
                            <Stat>
                              <StatLabel>Account Value</StatLabel>
                              <StatNumber>${account.accountValue}</StatNumber>
                            </Stat>
                          </CardBody>
                          <CardFooter>
                            <Button
                              onClick={() => {
                                onDeleteAccount(index);
                              }}
                              size="xs"
                              variant="link"
                            >
                              Delete
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </SimpleGrid>
                )}
              </Box>

              <SubmitButton colorScheme={"green"}>Next Step</SubmitButton>
            </Container>
          )}
        </Formik>
      </Container>

      <RecurringExpenseModal
        isOpen={recurringExpensesModalProps.isOpen}
        onClose={recurringExpensesModalProps.onClose}
        uid={userData?.uid}
      />

      <LoanAccountModal
        isOpen={loanAccountModalProps.isOpen}
        onClose={loanAccountModalProps.onClose}
        uid={userData?.uid}
      />

      <BankAccountModal
        isOpen={bankAccountModalProps.isOpen}
        onClose={bankAccountModalProps.onClose}
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
    </ProtectedRoute>
  );
}
