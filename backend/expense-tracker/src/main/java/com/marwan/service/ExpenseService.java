package com.marwan.service;
import com.marwan.model.Expense;
import com.marwan.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExpenseService {
    private ExpenseRepository expenseRepository;
    public ExpenseService(ExpenseRepository expenseRepository){
        this.expenseRepository=expenseRepository;
    }
    public Expense save(Expense expense){
        return expenseRepository.save(expense);
    }
    public List<Expense> getByUserId(String userId){
        return expenseRepository.findByUserId(userId);
    }
}