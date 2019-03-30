# Overview
Allows users to set pre-configured settings for input fields in a KVStore.

You can view this in action by going to the 'Demo' dashboard.

# How it works
- First, select a 'car_type' and then fill in the other fields and then click the 'Save Configuration'
button. A success message will show once a configuration is saved.
- Once you save a configuration for a particular car_type, select it in the dropdown and then
the other fields will populate based on the values in the KVstore.
- You can view the current values in the KVStore by running `| inputlookup dashboard_input_settings`

