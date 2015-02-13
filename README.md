# jsonsqlonline
Querying JSON Objects online
http://anandsunderraman.github.io/jsonsqlonline
This is an online tool to query json objects.

Queries could look like:

1. ````
   select <key1>, <key2>, ..... <keyn> 
   from <json>
   ````
   Where key1, key2, .... keyn are keys in the json object

2. The json object could also be nested, which means the following query is also valid
   select <key1>, <key2>, ..... <keyn> 
   from <path.to.nested.json>
   Where key1, key2, .... keyn are keys in the json object located @ path.to.nested.json

TODO:
1. Provide for where clause
2. Make the javascript library a submodule
3. Jasmine tests
4. Provide for group by feature
