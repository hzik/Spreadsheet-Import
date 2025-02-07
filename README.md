# Spreadsheet-Import

This tool allows you to import or update your table data into Kontent.ai.

This tool is based on [https://datatables.net/](https://bossanova.uk/jspreadsheet/), which is under Free MIT license.

You can test it here -> [Spreadsheet Import](https://kontentapp.azurewebsites.net/apps/spreadsheet_import/)

## Importing new items

You don't have to specify the Item name or the External ID in your spreadsheet data when importing new items. However, when you don't specify the External ID column, you won't be able to update that item in the future using this tool and you won't be able to import language variants of this item to other languages in your project. "Import as new items" is checked.

## Updating items

While updating items, your table data must contain External IDs for the tool to find items to update. "Import as new items" is unchecked.

## Importing language variants

While importing new language variants, your table data must contain External IDs for the tool to know which variant of an item that is. "Import as new items" is unchecked.

## Deploying

You can use Netlify or download it and open it locally (no server needed)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hzik/Spreadsheet-Import/)
