package com.example.lyx.myapplication.ch03;

import android.app.Activity;
import android.content.res.Resources;
import android.os.Bundle;
import android.widget.Button;

import com.example.lyx.myapplication.R;

/**
 * Created by lyx on 2016/7/12.
 */
public class TestDimensionActivity extends Activity {
    private Button myButton;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.test_dimen);
        myButton = (Button)findViewById(R.id.Button01);

        Resources r = getResources();
        float btn_h = r.getDimension(R.dimen.btn_height);
        float btn_w = r.getDimension(R.dimen.btn_width);

        myButton.setHeight((int) btn_h);
        myButton.setWidth((int)btn_w);
    }
}
