require(
    [
        'jquery',
        'splunkjs/mvc'
    ],
    function ($, mvc) {

        // Create an instance of the save button
        const save_config_button = $(`<button id="saveConfigButton" class="btn btn-primary">Save Configuration</button>`);

        // Success message indicating config was saved
        const success_message = $(`
        <div id="successMessage" style="padding: 10px; background: #5cc05c; color: #FFFFFF; display: none">
            Successfully saved the configuration!
        </div>`);

        // Instance of submitted tokens otherwise known as $form.tok$ in dashboard
        const submitted_tokens = mvc.Components.get('submitted');

        // Instance of the multiselect -- we need this to populate it from the KV store when we retrieve the settings
        const car_model_multiselect = mvc.Components.get('car_model_multiselect');

        // Instances of searches in our dashboard referenced by their ids
        const save_dashboard_settings_search = mvc.Components.get('save_dashboard_settings_search');
        const check_for_saved_settings_search = mvc.Components.get('check_for_saved_settings_search');

       /*
        * Get the results of a matching setting in the KV. This search is called on the dashboard init event
        * as well as when the multi-valued field 'car_model_multiselect' is selected
        */
        const check_for_saved_settings_results = check_for_saved_settings_search.data("results", {count: 0});

        // Append the button to the dashboard
        $('.dashboard-form-globalfieldset').append(save_config_button);

        // Handle the click event on the save_config_button
        save_config_button.on('click', function () {
            // Disable it while the save action is occurring
            save_config_button.prop('disabled', true);
            // Change the text of the button to indicate its saving
            save_config_button.text('Saving...');
            /*
            Sets the save_config token so that the 'save_dashboard_settings_search' runs -- this is
            referenced in the depends of the 'save_dashboard_settings_search' e.g. depends="$save_config$"
            */
            submitted_tokens.set({'save_config': true});
            // Now run the search to save the settings
            save_dashboard_settings_search.startSearch();
        });

        // Listen for the search to complete
        save_dashboard_settings_search.on('search:done', function () {
            // Re-enable the save button
            save_config_button.prop('disabled', false);
            // Change the text back to default
            save_config_button.text('Save Configuration');
            // Prepend the success message
            $('.dashboard-form-globalfieldset').prepend(success_message);
            // Success message hidden by default - fade it in over 1 second, show for 3 seconds, then fade out 1 sec.
            success_message.fadeIn(1000).delay(3000).fadeOut(1000);
            // Unset the 'save_config' token so the save config search doesn't unintentionally run
            submitted_tokens.unset('save_config');
        });

        /*
        * Wait for the check_for_saved_settings_results search to get data
        */
        check_for_saved_settings_results.on("data", function () {
            // Get the results of data
            let rows = check_for_saved_settings_results.data().rows;
            // Loops through the results
            rows.forEach(function (row) {
                // Turn result into an array
                let car_models = row[0].split(' ');
                // Populate the multi-select with the value of all the models
                car_model_multiselect.val(car_models);
            });

        });

    });