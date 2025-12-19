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
2. we wrote custom logic with AI
3. now we need to make sure that we are able to update column suggestions
   to do that we need to write a function that can fetch the schema based on the json path
17th Dec 2025
4. We now have the schema working. We now need to do the following
   a. When column names are typed with "." then we need to look ahead to autocomplete - *** Completed
   b. When column is selected then we need to automatically run query - *** Completed
   c. Implement auto complete for the table names
   c. Allow '*' to be added and when added remove other columns and vice versa