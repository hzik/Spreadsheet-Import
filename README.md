# Spreadsheet-Import

This tool allows you to import or update your table data into Kontent.ai.

This tool is based on [https://bossanova.uk/jspreadsheet/](https://bossanova.uk/jspreadsheet/), which is under Free MIT license.

You can test it here -> [Spreadsheet Import](https://kontentapp.azurewebsites.net/apps/spreadsheet_import/)

## Importing new items

You don't have to specify the Item name or the External ID in your spreadsheet data when importing new items. However, when you don't specify the External ID column, you won't be able to update that item in the future using this tool and you won't be able to import language variants of this item to other languages in your project. "Import as new items" is checked.

## Updating items

While updating items, your table data must contain External IDs for the tool to find items to update. "Import as new items" is unchecked.

## Importing language variants

While importing new language variants, your table data must contain External IDs for the tool to know which variant of an item that is. "Import as new items" is unchecked.

## Importing non-simple element values

When importing content to rich text, the content needs to be formatted based on our guidelines -> https://kontent.ai/learn/docs/apis/openapi/management-api-v2/#section/HTML5-elements-allowed-in-rich-text. 

Importing array values such as content for Multiple choice, Taxonomy, Linked items and Subpages element needs to be in format of a list of codenames separated by a comma -> first,second,third

## Deploying

You can use Netlify or download it and open it locally (no server needed)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/hzik/Spreadsheet-Import/)
