Apparel
=======

A website for building a custom t-shirt, built for the University of Nottingham G51WPS module in the year 2012/13. This website was built using HTML5, CSS3, JavaScript and PHP.

The design of the website is unique and features a single index page which loads seperate HTML files into a container, avoiding any page reloading. All session data is local via HTML5 sessions and client-server communication is kept to a minimum and only occurs when the order is sent by the user.

To maintain ease of navigation, the [jQuery Address] [1] Library is used to enable navigation between pages even when the physical container page doesn't change.


Notes
-----

A database is required to use the solution. The SQL script to create the database is provided in `/master/sql/` but the PHP script `/master/php/send.php` must be edited to connect to your individual setup.

<!-- References -->
[1]: http://www.asual.com/jquery/address/ "jQuery Address"
