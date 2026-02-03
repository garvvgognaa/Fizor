/**
 * Test Suite for 6 Investment Rules
 * Run this file to verify all investment calculation rules
 */

const InvestmentService = require('./src/services/investmentService');

console.log('🧪 Testing 6 Investment Rules\n');
console.log('='.repeat(60));

let allTestsPassed = true;

// RULE 1: 50-30-20 Budget Rule
console.log('\n📊 RULE 1: 50-30-20 Budget Rule');
console.log('-'.repeat(60));

try {
    const monthlyIncome = 100000;
    const result = InvestmentService.calculate50_30_20(monthlyIncome);

    console.log(`Input: Monthly Income = ₹${monthlyIncome}`);
    console.log(`Output: Needs = ₹${result.needsAmount} (50%)`);
    console.log(`        Wants = ₹${result.wantsAmount} (30%)`);
    console.log(`        Investment = ₹${result.investmentAmount} (20%)`);

    if (result.needsAmount === 50000 &&
        result.wantsAmount === 30000 &&
        result.investmentAmount === 20000) {
        console.log(' RULE 1 PASSED');
    } else {
        console.log(' RULE 1 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 1 FAILED:', error.message);
    allTestsPassed = false;
}
// RULE 2: Emergency Fund Rule

console.log('\n💰 RULE 2: Emergency Fund Rule');
console.log('-'.repeat(60));

try {
    const monthlyExpenses = 25000;
    const result = InvestmentService.calculateEmergencyFund(monthlyExpenses);

    console.log(`Input: Monthly Expenses = ₹${monthlyExpenses}`);
    console.log(`Output: Emergency Fund = ₹${result} (6x expenses)`);

    if (result === 150000) {
        console.log(' RULE 2 PASSED');
    } else {
        console.log(' RULE 2 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 2 FAILED:', error.message);
    allTestsPassed = false;
}
// RULE 3: 100 Minus Age Rule
console.log('\n🎂 RULE 3: 100 Minus Age Rule');
console.log('-'.repeat(60));

try {
    const age = 30;
    const result = InvestmentService.calculateAllocation(age, 'medium', []);

    console.log(`Input: Age = ${age}, Risk = medium, Goals = []`);
    console.log(`Output: Equity = ${result.equityPercentage}% (100-${age}=70, capped at medium risk 60%)`);
    console.log(`        Debt = ${result.debtPercentage}%`);

    // For age 30 with medium risk, equity should be min(70, 60) = 60
    if (result.equityPercentage === 60 && result.debtPercentage === 40) {
        console.log(' RULE 3 PASSED');
    } else {
        console.log(' RULE 3 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 3 FAILED:', error.message);
    allTestsPassed = false;
}

// RULE 4: Risk Appetite Rule

console.log('\n⚠️  RULE 4: Risk Appetite Rule');
console.log('-'.repeat(60));

try {
    // Test Low Risk - Max 30%
    const lowRisk = InvestmentService.calculateAllocation(25, 'low', []);
    console.log(`Low Risk (age 25): Equity = ${lowRisk.equityPercentage}% (max 30%)`);

    // Test Medium Risk - Max 60%
    const medRisk = InvestmentService.calculateAllocation(25, 'medium', []);
    console.log(`Medium Risk (age 25): Equity = ${medRisk.equityPercentage}% (max 60%)`);

    // Test High Risk - Max 90%
    const highRisk = InvestmentService.calculateAllocation(25, 'high', []);
    console.log(`High Risk (age 25): Equity = ${highRisk.equityPercentage}% (max 90%)`);

    if (lowRisk.equityPercentage <= 30 &&
        medRisk.equityPercentage <= 60 &&
        highRisk.equityPercentage <= 90) {
        console.log(' RULE 4 PASSED');
    } else {
        console.log(' RULE 4 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 4 FAILED:', error.message);
    allTestsPassed = false;
}
// RULE 5: Goal-Based Allocation Rule
console.log('\n🎯 RULE 5: Goal-Based Allocation Rule');
console.log('-'.repeat(60));

try {
    // Test Car goal (30/70 split)
    const carGoal = InvestmentService.calculateAllocation(30, 'medium', ['Car']);
    console.log(`Car Goal: Equity = ${carGoal.equityPercentage}%, Debt = ${carGoal.debtPercentage}%`);

    // Test House goal (60/40 split)
    const houseGoal = InvestmentService.calculateAllocation(30, 'medium', ['House']);
    console.log(`House Goal: Equity = ${houseGoal.equityPercentage}%, Debt = ${houseGoal.debtPercentage}%`);

    // Test Education goal (70/30 split) - but limited by medium risk (60%)
    const eduGoal = InvestmentService.calculateAllocation(30, 'medium', ['Education']);
    console.log(`Education Goal: Equity = ${eduGoal.equityPercentage}%, Debt = ${eduGoal.debtPercentage}%`);

    // Test Wealth creation (85/15) - but limited by medium risk (60%)
    const wealthGoal = InvestmentService.calculateAllocation(30, 'high', ['Wealth creation']);
    console.log(`Wealth Creation Goal (High Risk): Equity = ${wealthGoal.equityPercentage}%, Debt = ${wealthGoal.debtPercentage}%`);

    if (carGoal.equityPercentage === 30 && carGoal.debtPercentage === 70 &&
        houseGoal.equityPercentage === 60 && houseGoal.debtPercentage === 40) {
        console.log(' RULE 5 PASSED');
    } else {
        console.log(' RULE 5 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 5 FAILED:', error.message);
    allTestsPassed = false;
}

// RULE 6: SIP Calculation Rule
console.log('\n💸 RULE 6: SIP Calculation Rule');
console.log('-'.repeat(60));

try {
    const investmentAmount = 20000;
    const equityPercentage = 70;
    const debtPercentage = 30;

    const result = InvestmentService.calculateSIP(investmentAmount, equityPercentage, debtPercentage);

    console.log(`Input: Investment Amount = ₹${investmentAmount}`);
    console.log(`       Equity % = ${equityPercentage}%, Debt % = ${debtPercentage}%`);
    console.log(`Output: Total SIP = ₹${result.monthlySip}`);
    console.log(`        Equity SIP = ₹${result.equitySip} (70%)`);
    console.log(`        Debt SIP = ₹${result.debtSip} (30%)`);

    if (result.monthlySip === 20000 &&
        result.equitySip === 14000 &&
        result.debtSip === 6000) {
        console.log(' RULE 6 PASSED');
    } else {
        console.log('RULE 6 FAILED');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' RULE 6 FAILED:', error.message);
    allTestsPassed = false;
}

// INTEGRATION TEST
console.log('\n🔗 INTEGRATION TEST: All Rules Combined');
console.log('-'.repeat(60));

try {
    const params = {
        age: 30,
        monthlyIncome: 100000,
        monthlyExpenses: 40000,
        riskAppetite: 'medium',
        goals: ['House', 'Wealth creation']
    };

    const result = InvestmentService.calculateInvestmentRecommendation(params);

    console.log('Input:');
    console.log(`  Age: ${params.age}`);
    console.log(`  Monthly Income: ₹${params.monthlyIncome}`);
    console.log(`  Monthly Expenses: ₹${params.monthlyExpenses}`);
    console.log(`  Risk Appetite: ${params.riskAppetite}`);
    console.log(`  Goals: ${params.goals.join(', ')}`);
    console.log('\nOutput:');
    console.log(`  Needs Amount: ₹${result.needsAmount}`);
    console.log(`  Wants Amount: ₹${result.wantsAmount}`);
    console.log(`  Investment Amount: ₹${result.investmentAmount}`);
    console.log(`  Emergency Fund: ₹${result.emergencyFund}`);
    console.log(`  Equity %: ${result.equityPercentage}%`);
    console.log(`  Debt %: ${result.debtPercentage}%`);
    console.log(`  Monthly SIP: ₹${result.monthlySip}`);
    console.log(`  Equity SIP: ₹${result.equitySip}`);
    console.log(`  Debt SIP: ₹${result.debtSip}`);

    // Verify all fields exist
    if (result.needsAmount && result.wantsAmount && result.investmentAmount &&
        result.emergencyFund && result.equityPercentage && result.debtPercentage &&
        result.monthlySip && result.equitySip && result.debtSip) {
        console.log(' INTEGRATION TEST PASSED - All fields present');
    } else {
        console.log(' INTEGRATION TEST FAILED - Missing fields');
        allTestsPassed = false;
    }
} catch (error) {
    console.log(' INTEGRATION TEST FAILED:', error.message);
    allTestsPassed = false;
}
// FINAL RESULT
console.log('\n' + '='.repeat(60));
if (allTestsPassed) {
    console.log(' ALL TESTS PASSED! ');
    console.log('All 6 investment rules are working correctly.');
    process.exit(0);
} else {
    console.log(' SOME TESTS FAILED');
    console.log('Please review the failed tests above.');
    process.exit(1);
}
