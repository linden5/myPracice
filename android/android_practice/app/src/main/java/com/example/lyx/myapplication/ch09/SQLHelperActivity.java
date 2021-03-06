package com.example.lyx.myapplication.ch09;

import android.app.Activity;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.os.Bundle;
import android.widget.Toast;

import com.example.lyx.myapplication.R;

/**
 * Created by lyx on 2016/7/19.
 */
public class SQLHelperActivity extends Activity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        MyDBHelper helper = new MyDBHelper(this);
        helper.insert();
        helper.query();
    }

    class MyDBHelper extends SQLiteOpenHelper {
        private static final String CREATE_TABLE_SQL = " create table TempTbl(_id integer, name text) ";
        private SQLiteDatabase db;

        MyDBHelper(Context c) {
            super(c, "test.db", null, 2);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL(CREATE_TABLE_SQL);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {}

        private void insert() {
            String sql = "insert into TempTbl(_id, name) values(1, 'amaker')";
            getWritableDatabase().execSQL(sql);
        }

        private void query() {
            Cursor c = getWritableDatabase().query("TempTbl", null, null, null, null, null, null);
            if(c.moveToFirst()) {
                for (int i = 0; i < c.getCount(); i++) {
                    c.move(i);
                    int id = c.getInt(0);
                    String name = c.getString(1);
                    Toast.makeText(SQLHelperActivity.this, name, Toast.LENGTH_LONG).show();
                }
            }
        }
    }
}
