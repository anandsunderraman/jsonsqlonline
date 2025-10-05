# jsonsqlonline
Querying JSON Objects online
http://anandsunderraman.github.io/jsonsqlonline
This is an online tool to query json objects.

For more details and screenshots on how to use this tool please read my blog http://jsonsqlonline.blogspot.com/2015/06/querying-json-objects-using-sqlish.html

Queries could look like:

1. Simple select query looks like

   ````
   select <key1>, <key2>, ..... <keyn> 
   from <json>
   ````
   Where key1, key2, .... keyn are keys in the json object

2. The json object could also be nested, which means the following query is also valid

   ````
   select <key1>, <key2>, ..... <keyn> 
   from <path.to.nested.json>
   ````
   Where key1, key2, .... keyn are keys in the json object located @ path.to.nested.json

TODO:

* Report issues on github
* Autocomplete using JSON schema
* Github actions

## Contribution Guide

This is a simple web app running on angular 1 and bootstrap

1. Fork the repo
2. Clone the repo
3. Paste the code into any simple web server
   ```
   python3 -m http.server
   ```
4. Open index.html and you are all set !!
