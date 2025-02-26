package com.dsciiita.inclusivo.activities;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.dsciiita.inclusivo.R;
import com.dsciiita.inclusivo.api.ApiClient;
import com.dsciiita.inclusivo.databinding.ActivityFilterBinding;
import com.dsciiita.inclusivo.models.Company;
import com.dsciiita.inclusivo.responses.CompanyListsResponse;
import com.dsciiita.inclusivo.storage.SharedPrefManager;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class FilterCompanyActivity extends AppCompatActivity {

    ActivityFilterBinding binding;
    String selected;
    ArrayList<String> values, types, companies;
    ArrayList<Integer> companySelected;
    ArrayAdapter<String> arrayAdapter, typeAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityFilterBinding.inflate(LayoutInflater.from(this));
        setContentView(binding.getRoot());

        binding.toolbar.setNavigationOnClickListener(view -> finish());

        binding.slidersLayout.setVisibility(View.GONE);

        values = new ArrayList<>();
        types = new ArrayList<>();
        companySelected = new ArrayList<>();

        types.add("Title");

        getCompanies();

        arrayAdapter = new ArrayAdapter<>(this, R.layout.filter_view, values);
        binding.options.setAdapter(arrayAdapter);

        typeAdapter = new ArrayAdapter<>(this, R.layout.types_list_item, types);
        binding.type.setAdapter(typeAdapter);

        for(int i=0;i< values.size(); i++ )  {
            binding.options.setItemChecked(i,false);
        }

        binding.options.setChoiceMode(ListView.CHOICE_MODE_MULTIPLE);


        binding.options.setOnItemClickListener((parent, view, position, id) -> {
            switch (selected) {
                case "Company":
                    if (binding.options.isItemChecked(position))
                        companySelected.add(position);
                    else if (companySelected.contains(position))
                        companySelected.remove(Integer.valueOf(position));
                    break;
            }
        });



        binding.type.setOnItemClickListener((parent, view, position, id) -> {
            values.clear();
            if(position==0){
                selected = "Company";
                values.addAll(companies);
                setChecked(companySelected);
            }
            arrayAdapter.notifyDataSetChanged();
        });


        binding.apply.setOnClickListener(view->{
            createFilter();
        });

        binding.reset.setOnClickListener(view->{
            clearFilter();
        });


    }

    private void clearFilter() {
        companySelected.clear();
        for(int i=0;i< values.size(); i++ )  {
            binding.options.setItemChecked(i,false);
        }
    }


    private void setChecked(ArrayList<Integer> arrayList) {
        for(int i=0; i< binding.options.getAdapter().getCount(); i++)  {
            binding.options.setItemChecked(i, false);
        }
        try {
            for(int i=0; i< arrayList.size(); i++)  {
                binding.options.setItemChecked(arrayList.get(i), true);
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }

    }


    private void getCompanies() {
        binding.progressBar.setVisibility(View.VISIBLE);

        String token = "token "+ SharedPrefManager.getInstance(this).getToken();
        companies = new ArrayList<>();
        Call<CompanyListsResponse> userRequestCall = ApiClient.getUserService().getCompanies(token);
        userRequestCall.enqueue(new Callback<CompanyListsResponse>() {
            @Override
            public void onResponse(Call<CompanyListsResponse> call, Response<CompanyListsResponse> response) {
                if(response.isSuccessful()) {
                    Company[] companyList = response.body().getData();
                    for (Company company : companyList) {
                        companies.add(company.getName());
                    }
                } else {
                    Toast.makeText(FilterCompanyActivity.this, "Something went wrong", Toast.LENGTH_SHORT).show();
                }
                binding.progressBar.setVisibility(View.GONE);
            }
            @Override
            public void onFailure(Call<CompanyListsResponse> call, Throwable t) {
                Log.i("ERROR FAILURE", t.getMessage());
            }
        });
    }


    private void createFilter() {
        StringBuilder finalCompanies = new StringBuilder();
        for(int i=0; i<companySelected.size(); i++){
            if(i!=companySelected.size()-1)
                finalCompanies.append(companies.get(companySelected.get(i))).append("#@#");
            else
                finalCompanies.append(companies.get(companySelected.get(i)));
        }


        Intent resultIntent = new Intent();
        resultIntent.putExtra("name", finalCompanies.toString());
        setResult(Activity.RESULT_OK, resultIntent);
        finish();
    }
}