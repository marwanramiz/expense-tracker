package com.marwan.controller;
import com.marwan.model.Expense;
import com.marwan.service.ExpenseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    @Autowired private ExpenseService expenseService;
    @PostMapping
    public Expense addExpense(@RequestBody Expense expense){
        return expenseService.save(expense);
    }
    @GetMapping("/{userId}")
    public List<Expense> getExpenses(@PathVariable String userId){
        return expenseService.getByUserId(userId);
    }
}