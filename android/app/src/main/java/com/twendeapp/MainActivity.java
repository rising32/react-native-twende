package com.twendeapp;

import android.content.Intent;
import android.os.Bundle;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.marianhello.react.BackgroundGeolocationPackage;

import com.facebook.react.ReactActivity;
import com.marianhello.react.BackgroundGeolocationPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.AirMaps.AirPackage;


import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {
    CallbackManager mCallbackManager;

    private ReactNativePushNotificationPackage mReactNativePushNotificationPackage;


    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "TwendeApp";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */

    @Override
    protected List<ReactPackage> getPackages() {
        mCallbackManager = new CallbackManager.Factory().create();
        mReactNativePushNotificationPackage = new ReactNativePushNotificationPackage(this);

        ReactPackage packages[] = new ReactPackage[]{
            new MainReactPackage(),
            new BackgroundGeolocationPackage(),
            new FBSDKPackage(mCallbackManager),
            new ImagePickerPackage(),
            new AirPackage(),
            new BackgroundGeolocationPackage(),
            mReactNativePushNotificationPackage
        };
        return Arrays.<ReactPackage>asList(packages);
    }

    @Override
    protected void onNewIntent (Intent intent) {
      super.onNewIntent(intent);

      mReactNativePushNotificationPackage.newIntent(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        mCallbackManager.onActivityResult(requestCode, resultCode, data);

    }


}
