# GoogleAnalyticsSheetProductUpload
Google Apps script to post a Google Sheet to Google Analytics as Product Data Import using the Management API

## Pre-requisites:
- Google Analytics property 
			- with Enhanced eCommerce enabled
			- with at least one Data Import set up for Product Data
- A Google Sheet with access granted to Google Analytics API
- Your eCommerce-capable website has Google Analytics code implemented with only SKUs for detail, addToCart, Remove, checkout and purchase events

## Enabling Google Analytics Enhanced eCommerce
1. In your Google Analytics admin panel, locate your property and your view.
2. Under eCommerce settings, enable eCommerce then enable Enhanced eCommerce.
3. Implement your tracking code on your site, along with eCommerce-specific tagging, using only the SKU and not the full complement of product attributes

## Using Google App Script in Google Sheets
1. Create a blank Google Sheet, with two sheets, one labelled "Data" and one labelled "Settings"
2. Fill the *Data* sheet with your desired upload data, using your Data Import schema as columns
3. Go to Tools > Script Editor
4. Edit the Code.gs file and use/adjust the code provided in this project.

## Enabling Google Analytics API access in Google Sheets
1. Open your Google Sheet
2. Go to *Tools* > *Script Editor*
3. In the editor, go to *Resources* > *Advanced Google services*
4. In the list of services, scroll down to *Google Analytics API* and enable it

## Testing your script
- To test your script, 
	- From the Editor, simply select the *main* function and click the "Play" button to the left of the drop-down menu
	- From the Sheet, use the dropdown menu and select Upload, then Generate...
- Go through the Google authentication dialog (you may need to use 2-factor authentication)
- You can also go to *View* > *Execution transcript* to look at console output
- Go to your Google Analytics property and look for new uploads sent by the script via the API

## Extra credit: scheduling uploads
Assuming your product feed is updated regularly, you can schedule your script to run on a regular basis. Thankfully, Google Sheets provides this scheduling for you.

- From the script editor, remove the msgBox instruction at the end of the *main* function, save, click the "clock" icon or go to *Edit* > *Current project's triggers*
- If the trigger list is empty, click the blue button to create a new trigger
- In the function dropdown menu, select your *main* function
- In event source, select Time-driven then select a frequency, e.g. *Week timer* and set it to run (for instance) every Monday at 8am
- Save your trigger and enjoy your automatically updated product attributes in Google Analytics!
