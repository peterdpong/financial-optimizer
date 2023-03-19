import { Suggestion, UserModel } from "../models/UserModel";
import { TransactionCategories } from "../models/BudgetModel";
import { updateSuggestion } from "../firebase/UserActions";
import { enumKeys } from "../utils";
import { BankInvestmentAccount } from "../models/AccountModel";

const CategoryPercentages: { [categoryKey: string]: number } = {
  [TransactionCategories.GROCERIES]: 10,
  [TransactionCategories.ENTERTAINMENT]: 5,
  [TransactionCategories.UTILITIES]: 4,
  [TransactionCategories.MOBILEPLAN]: 1,
  [TransactionCategories.HOUSING]: 35,
  [TransactionCategories.TRANSPORTATION]: 15,
  [TransactionCategories.DININGOUT]: 5,
  [TransactionCategories.CLOTHING]: 5,
  [TransactionCategories.TRAVEL]: 5,
  [TransactionCategories.EDUCATION]: 7.5,
  [TransactionCategories.INTEREST]: 5,
  [TransactionCategories.SAVINGS]: 7.5,
};

export class SuggestionEngine {
  // Grab one suggestions from each type
  static getTopTwoSuggestions(userData: UserModel | null) {
    if (userData === null) return;

    const suggestionOverview: Suggestion[] = [];

    if (
      userData.suggestions["SpendingAndBudget"] &&
      userData.suggestions["SpendingAndBudget"].length > 0
    ) {
      suggestionOverview.push(userData.suggestions["SpendingAndBudget"][0]);
    }

    if (
      userData.suggestions["MoneyAllocation"] &&
      userData.suggestions["MoneyAllocation"].length > 0
    ) {
      suggestionOverview.push(userData.suggestions["MoneyAllocation"][0]);
    }

    if (
      userData.suggestions["GoalAndSavings"] &&
      userData.suggestions["GoalAndSavings"].length > 0
    ) {
      suggestionOverview.push(userData.suggestions["GoalAndSavings"][0]);
    }

    if (
      userData.suggestions["FinancialHealth"] &&
      userData.suggestions["FinancialHealth"].length > 0
    ) {
      suggestionOverview.push(userData.suggestions["FinancialHealth"][0]);
    }

    return suggestionOverview;
  }

  // This function runs all the generation for Spending/Budget Suggestions
  static generateAllSpendingBudgetSuggestions(userData: UserModel | null) {
    if (userData === null) return;
    const suggestionType = "SpendingAndBudget";
    let allSpendingBudgetSuggestions: Suggestion[] = [];

    // Category Suggestions
    const categorySuggestions =
      SuggestionEngine.generateCategorySuggestions(userData);
    if (categorySuggestions)
      allSpendingBudgetSuggestions =
        allSpendingBudgetSuggestions.concat(categorySuggestions);

    // Allocated Budget Suggestions
    const selfBudgetSuggestions =
      SuggestionEngine.generateBudgetSelfComparisons(userData);
    if (selfBudgetSuggestions)
      allSpendingBudgetSuggestions = allSpendingBudgetSuggestions.concat(
        selfBudgetSuggestions
      );

    console.log(allSpendingBudgetSuggestions);
    updateSuggestion(
      userData.uid,
      suggestionType,
      allSpendingBudgetSuggestions,
      userData.suggestions
    );
  }

  static generateBudgetSelfComparisons(userData: UserModel) {
    const suggestionType = "SpendingAndBudget";
    const suggestionBadge = "Over spent budget";
    const budgetSelfComparisons: Suggestion[] = [];

    const categorySpend: { [categoryKey: string]: number } = {
      [TransactionCategories.GROCERIES]: 0,
      [TransactionCategories.ENTERTAINMENT]: 0,
      [TransactionCategories.UTILITIES]: 0,
      [TransactionCategories.MOBILEPLAN]: 0,
      [TransactionCategories.HOUSING]: 0,
      [TransactionCategories.TRANSPORTATION]: 0,
      [TransactionCategories.DININGOUT]: 0,
      [TransactionCategories.CLOTHING]: 0,
      [TransactionCategories.TRAVEL]: 0,
      [TransactionCategories.EDUCATION]: 0,
      [TransactionCategories.INTEREST]: 0,
      [TransactionCategories.SAVINGS]: 0,
    };
    const lastMonth: Date = new Date();
    lastMonth.setMonth(lastMonth.getMonth());
    const lastMonthKey =
      lastMonth.getUTCMonth().toString() +
      "-" +
      lastMonth.getUTCFullYear().toString();
    if (userData.monthTransactionsMap[lastMonthKey] === undefined) {
      return;
    }

    // loop through every transaction ever made by this user
    userData.monthTransactionsMap[lastMonthKey].forEach((transaction) => {
      // for each transaction made in the last month - negative we are looking at percentage spend
      if (transaction.category in CategoryPercentages) {
        categorySpend[transaction.category] += -transaction.amount;
      }
    });

    for (const category of enumKeys(TransactionCategories)) {
      if (userData.budgetInfo.monthlyAllocations[category]) {
        if (
          categorySpend[TransactionCategories[category]] >
          userData.budgetInfo.monthlyAllocations[category].allocation
        ) {
          const newSuggestion: Suggestion = {
            suggestionType: suggestionType,
            badgeColor: "red",
            suggestionBadge: suggestionBadge,
            suggestionTitle: `Last month you spent more than you allocated budget for ${TransactionCategories[category]}`,
            suggestionDescription: `Your allocated budget for ${
              TransactionCategories[category]
            } for a month was $${
              userData.budgetInfo.monthlyAllocations[category].allocation
            }. Last month you spent $${
              categorySpend[TransactionCategories[category]]
            } which is over you allocated budget by $${
              categorySpend[TransactionCategories[category]] -
              userData.budgetInfo.monthlyAllocations[category].allocation
            }`,
          };
          budgetSelfComparisons.push(newSuggestion);
        }
      }
    }

    return budgetSelfComparisons;
  }

  static generateCategorySuggestions(userData: UserModel) {
    const categorySpend: { [categoryKey: string]: number } = {
      [TransactionCategories.GROCERIES]: 0,
      [TransactionCategories.ENTERTAINMENT]: 0,
      [TransactionCategories.UTILITIES]: 0,
      [TransactionCategories.MOBILEPLAN]: 0,
      [TransactionCategories.HOUSING]: 0,
      [TransactionCategories.TRANSPORTATION]: 0,
      [TransactionCategories.DININGOUT]: 0,
      [TransactionCategories.CLOTHING]: 0,
      [TransactionCategories.TRAVEL]: 0,
      [TransactionCategories.EDUCATION]: 0,
      [TransactionCategories.INTEREST]: 0,
      [TransactionCategories.SAVINGS]: 0,
    };
    const availableFunds = userData.budgetInfo.monthlyVariableBudgetUnallocated; // total funds available for allocation
    const lastMonth: Date = new Date();
    lastMonth.setMonth(lastMonth.getMonth());
    const lastMonthKey =
      lastMonth.getUTCMonth().toString() +
      "-" +
      lastMonth.getUTCFullYear().toString();
    if (userData.monthTransactionsMap[lastMonthKey] === undefined) {
      return;
    }

    // loop through every transaction ever made by this user
    userData.monthTransactionsMap[lastMonthKey].forEach((transaction) => {
      // for each transaction made in the last month - negative we are looking at percentage spend
      if (transaction.category in CategoryPercentages) {
        categorySpend[transaction.category] += -transaction.amount;
      }
    });

    const suggestionArray: Suggestion[] = [];
    const suggestionType = "SpendingAndBudget";
    const suggestionBadge = "Category Spending";
    for (const category of enumKeys(TransactionCategories)) {
      if (categorySpend[TransactionCategories[category]] < 0) {
        // Skip category if negative as it implies no spending rather money gained
        continue;
      }

      // Calculate the percentage of income spend on specific category and compare to recommended standard
      const totalCategorySpendPercentage: number =
        (categorySpend[TransactionCategories[category]] / availableFunds) * 100;
      const targetPercent: number =
        CategoryPercentages[TransactionCategories[category]];

      if (totalCategorySpendPercentage > targetPercent) {
        //Their percentage spend is greater than target recommended, create a suggestion
        const reduceAmount =
          (totalCategorySpendPercentage - targetPercent) * availableFunds;

        const newSuggestion: Suggestion = {
          suggestionType: suggestionType,
          badgeColor: "red",
          suggestionBadge: suggestionBadge,
          suggestionTitle: `Your spending in ${
            TransactionCategories[category]
          } last month was ${Math.trunc(
            totalCategorySpendPercentage
          )}% of your monthly income, higher than the recommended percentage.`,
          suggestionDescription: `Based on budgetting guidelines set by The Credit Counselling Society, you should aim to spend ${targetPercent}% of your income on ${
            TransactionCategories[category]
          }. Analyzing your last month spending on ${
            TransactionCategories[category]
          }, we found you spent ${Math.trunc(
            totalCategorySpendPercentage
          )}% of your monthly income on ${
            TransactionCategories[category]
          } which is ${Math.trunc(
            totalCategorySpendPercentage - targetPercent
          )}%. It is recommened for you to reduce you spending in this category by $${reduceAmount}!`,
        };
        suggestionArray.push(newSuggestion);
      }
    }

    // nts: future reference once we add source -> https://www.mymoneycoach.ca/budgeting/budgeting-guidelines
    return suggestionArray;
  }

  // static generateDemographicSuggestions(userData: UserModel | null) {
  //   //do something
  // }

  // ---- Money Allocation Suggestions  ----

  static generateMoneyAllocationSuggestions(userData: UserModel | null) {
    if (userData === null) return;
    const suggestionType = "MoneyAllocation";
    const allMoneyAllocationSuggestions: Suggestion[] = [];

    // Analyze debts vs savings allocation
    // Analyze best debt repayment
    // Debt projection

    // Move sitting money in low interest and analyze user's accounts
    let userHighInterestRateAccount: BankInvestmentAccount | undefined =
      undefined;
    const moveMoneyActions: string[] = [
      "If you do not need the money short-term, consider utilizing fixed guaranteed investments with lock-in terms varying from 6 months to 5 years at a fixed interest rate. Additionally, fixed investments tend to have more favourable interest rates (as your lock-in term increases) varying from 3% - 5%",
      "For very long savings timelines(10+ years), consider long-term investments into stocks, bonds, and index funds which average 6%-10% yearly returns. However, consider exploring your risk tolerance before you start investing as unlike savings accounts and fixed investments, your balance does not only go up.",
    ];
    // Check if user has a high interest savings account -> we consider an account with > 1.5%
    Object.values(userData.financialInfo.accounts.bankAccounts).forEach(
      (bankAccount) => {
        if (bankAccount.interestRate >= 1.5) {
          if (
            userHighInterestRateAccount === undefined ||
            userHighInterestRateAccount.interestRate < bankAccount.interestRate
          ) {
            userHighInterestRateAccount = bankAccount;
          }
        }
      }
    );

    if (userHighInterestRateAccount === undefined) {
      // User does not have a high-interest account -> suggestion opening one
      allMoneyAllocationSuggestions.push({
        suggestionType: suggestionType,
        suggestionBadge: "Account Suggestion",
        badgeColor: "blue",
        suggestionTitle:
          "You currently have a high interest savings account, considering opening one.",
        suggestionDescription: `A high interest savings account is one that has an interest rate higher than 1.5%. Consider opening on to hold short-term money while maximizing growth. See below for possible high interest savings accounts available.`,
        suggestionActions: [
          "EQ Bank Savings Plus Account - 2.5%",
          "Saven Financial High Interest Savings Account - 3.75%",
          "Oaken Financial Savings Account - 3.40%",
        ],
        source: [
          {
            link: "https://www.ratehub.ca/savings-accounts/accounts/high-interest",
            linkTitle: "Available High Interest Savings Accounts",
          },
        ],
      });
      moveMoneyActions.push(
        "For money needed in the short-term, consider opening a high interest savings account. See the other suggestion for further details!"
      );
    } else {
      moveMoneyActions.push(
        `For money needed in the short-term, consider moving it to your high-interest account ${
          (userHighInterestRateAccount as BankInvestmentAccount).name
        } which has an interest rate of ${
          (userHighInterestRateAccount as BankInvestmentAccount).interestRate
        }%`
      );
    }

    // In our analysis, we suggest moving money if we find any accounts with the following
    // Interest Rate <= 1% and an account value greater than their last months average spending
    Object.values(userData.financialInfo.accounts.bankAccounts).forEach(
      (bankAccount) => {
        if (bankAccount.interestRate <= 1 && bankAccount.value >= 1000) {
          const newSuggestion: Suggestion = {
            suggestionType: suggestionType,
            suggestionBadge: "Growth Opportunity",
            badgeColor: "green",
            suggestionTitle: `Move some of $${bankAccount.value} in your ${bankAccount.name} to better growth opportunities.`,
            suggestionDescription: `$${bankAccount.value} in your ${bankAccount.name} is only gaining ${bankAccount.interestRate}% interest per year. There are opportunities to move this money to higher interest rate accounts or investments. See the suggestions below of possible ways to maximize your savings based on your timeline.`,
            suggestionActions: moveMoneyActions,
            source: [
              {
                link: "https://www.ratehub.ca/gics/best-gic-rates",
                linkTitle: "Available GICs",
              },
              {
                link: "https://canadiancouchpotato.com/2012/06/25/what-are-normal-stock-market-returns/",
                linkTitle: "Average Stock Market Returns",
              },
              {
                link: "https://www.vanguard.ca/individual/questionnaire.htm#/",
                linkTitle: "Risk Tolerance Questionnaire",
              },
            ],
          };
          allMoneyAllocationSuggestions.push(newSuggestion);
        }
      }
    );

    updateSuggestion(
      userData.uid,
      suggestionType,
      allMoneyAllocationSuggestions,
      userData.suggestions
    );
  }

  // ---- Financial Health Suggestions  ----

  static generateFinancialHealthSuggestions(userData: UserModel | null) {
    if (userData === null) return;

    const suggestionType = "FinancialHealth";
    const financialHealthSuggestions: Suggestion[] = [];

    // Time Alerts
    const currentDate = new Date();

    // Taxes are always due April 30th of the current year
    const taxDueDate = new Date(currentDate.getFullYear(), 3, 30);
    if (currentDate < taxDueDate) {
      // Add suggestion/reminder of taxes
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${
          currentDate.getFullYear() - 1
        } Tax Deadline Reminder - ${taxDueDate.toDateString()}`,
        suggestionDescription: `Your ${
          currentDate.getFullYear() - 1
        } taxes are expected to be submitted by ${taxDueDate.toDateString()}. That is ${Math.floor(
          (taxDueDate.getTime() - currentDate.getTime()) / 86400000
        )} days away from today.`,
        suggestionBadge: `Tax Deadline`,
        badgeColor: "blue",
      });
    }

    const RRSPDepositDeadlinePrevTax = new Date(
      currentDate.getFullYear(),
      2,
      1
    );
    const RRSPDepositDeadlineCurrentTax = new Date(
      currentDate.getFullYear() + 1,
      2,
      1
    );
    if (currentDate < RRSPDepositDeadlinePrevTax) {
      // Add suggestion/reminder of previous years tax rrsp deposit deadline
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${
          currentDate.getFullYear() - 1
        } RRSP Deposit Deadline - ${RRSPDepositDeadlinePrevTax.toDateString()}`,
        suggestionDescription: `Your deadline to deposit into you RRSP for deduction on your ${
          currentDate.getFullYear() - 1
        } taxes is ${RRSPDepositDeadlinePrevTax.toDateString()}. That is ${Math.floor(
          (RRSPDepositDeadlinePrevTax.getTime() - currentDate.getTime()) /
            86400000
        )} days away from today.`,
        suggestionBadge: `RRSP Deposit Deadline`,
        badgeColor: "blue",
      });
    }

    if (currentDate < RRSPDepositDeadlineCurrentTax) {
      // Add suggestion/reminder of current year rrsp deposite deadline
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `${currentDate.getFullYear()} RRSP Deposit Deadline - ${RRSPDepositDeadlineCurrentTax.toDateString()}`,
        suggestionDescription: `Your deadline to deposit into you RRSP for deduction on your ${currentDate.getFullYear()} taxes is ${RRSPDepositDeadlineCurrentTax.toDateString()}. That is ${Math.floor(
          (RRSPDepositDeadlineCurrentTax.getTime() - currentDate.getTime()) /
            86400000
        )} days away from today.`,
        suggestionBadge: `RRSP Deposit Deadline`,
        badgeColor: "blue",
      });
    }

    // Emergency Fund Recommendation -- look back 3 months
    let averageThreeMonthsSpending = 0;
    const lookBackDate = new Date();
    lookBackDate.setMonth(lookBackDate.getMonth() - 3);
    let dateParts = lookBackDate.toISOString().split("T")[0].split("-");
    let monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];

    // Assumption here - we only calculate their average past 3 months spending if they
    // have some transaction for data for 3 months ago
    if (userData.monthTransactionsMap[monthAndYear]) {
      while (lookBackDate.getMonth() !== currentDate.getMonth()) {
        if (userData.monthTransactionsMap[monthAndYear]) {
          userData.monthTransactionsMap[monthAndYear].forEach((transaction) => {
            if (transaction.amount < 0) {
              // Again split the transaction amount to positive $ spent.
              averageThreeMonthsSpending += -transaction.amount;
            }
          });
        }

        lookBackDate.setMonth(lookBackDate.getMonth() + 1);
        dateParts = lookBackDate.toISOString().split("T")[0].split("-");
        monthAndYear = parseInt(dateParts[1]) + "-" + dateParts[0];
      }

      averageThreeMonthsSpending /= 3;
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `Build an emergency fund.`,
        suggestionDescription: `It is recommended you have at least 3-6 months worth of your living expenses as an emergency fund. Based on your last 3 months spending, you averaged monthly expenses of $${averageThreeMonthsSpending.toFixed(
          2
        )}. A good range of funds you should keep as an emergency fund is then $${(
          averageThreeMonthsSpending * 3
        ).toFixed(2)} to $${(averageThreeMonthsSpending * 6).toFixed(
          2
        )} which represent 3-6 months worth of expenses.`,
        suggestionBadge: `Emergency Fund`,
        badgeColor: "blue",
      });
    }

    // Debt Analysis
    // Ideal for all debts to not exceed their total assets
    let totalDebts = 0;
    Object.values(userData.financialInfo.accounts.loans).forEach((account) => {
      totalDebts += account.remainingAmount;
    });

    Object.values(userData.financialInfo.accounts.creditCards).forEach(
      (account) => {
        totalDebts += account.amountOwned;
      }
    );

    let totalAssets = 0;
    Object.values(userData.financialInfo.accounts.bankAccounts).forEach(
      (account) => {
        totalAssets += account.value;
      }
    );
    Object.values(userData.financialInfo.accounts.fixedInvestments).forEach(
      (account) => {
        totalAssets += account.startingValue;
      }
    );
    Object.values(userData.financialInfo.accounts.otherAssets).forEach(
      (account) => {
        totalAssets += account.value;
      }
    );

    const debtToAssetRatio = totalDebts / totalAssets;

    if (debtToAssetRatio > 0.5) {
      financialHealthSuggestions.push({
        suggestionType: suggestionType,
        suggestionTitle: `Debt to Asset ratio greater than 50%`,
        suggestionDescription: `It is recommended your total debt does not exceed 50% of your total assets. Currently your debts total to ${(
          debtToAssetRatio * 100
        ).toFixed(
          2
        )}% of your total assets. This percentage represents your individual ability to borrow, the higher the percentage the less you can borrow thus lowering your long-term financial flexibility.`,
        suggestionBadge: `Debt Ratio`,
        badgeColor: "red",
      });
    }

    updateSuggestion(
      userData.uid,
      suggestionType,
      financialHealthSuggestions,
      userData.suggestions
    );
  }
}
