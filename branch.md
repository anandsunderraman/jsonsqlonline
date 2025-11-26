# WIP Branch notes

Idea is to extract json schema as part for the createDB controller and set it to appContext
This is done when extracting the data.

Options of lib that can be used
a. https://github.com/ruzicka/to-json-schema
   appears to be simple and can be used out of the box
   Is hosted on CDN https://www.jsdelivr.com/package/npm/to-json-schema so don't require to bundle it
b. https://github.com/sagold/json-schema-library


Typeahead options that can be used are:

https://github.com/bassjobsen/Bootstrap-3-Typeahead
https://github.com/davidkonrad/angular-bootstrap3-typeahead

or

https://angular-ui.github.io/bootstrap/#!#typeahead


To work on
1. the current json schema library is not extract json schema for nested objects. Need to look at that library or write custom logic