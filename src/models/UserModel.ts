import {
  BankAccount,
  CreditCardAccount,
  FixedInvestment,
  LoanAccount,
} from "./AccountModel";
import { BudgetModel, Transaction } from "./BudgetModel";
import { GoalModel } from "./GoalModel";

export type UserModel = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  financialInfo: FinancialInfo;
  budgetInfo: BudgetModel;
  goalInfo: GoalModel;
  monthTransactionsMap: { [key: string]: Transaction[] };
};

export type AccountMap = {
  bankAccounts: { [key: string]: BankAccount };
  creditCards: { [key: string]: CreditCardAccount };
  loans: { [key: string]: LoanAccount };
  fixedInvestments: { [key: string]: FixedInvestment };
};

export type FinancialInfo = {
  monthlyIncome: number;
  monthlyTransactions: Transaction[];
  accounts: AccountMap;
};
