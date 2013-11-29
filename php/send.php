<?php
    /* Call the main function */
    main();
    
    /**
     * The main entry point for submitting session data to the database
     * The script must be called via an AJAX request
     */
    function main() {
        /* Check that the page was requested via AJAX */
        if (!empty($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest") {
            if (checkPostedFieldContent() && submitToDatabase()) {
                sleep(3);   /* Sleep to let the loading GIF catch up */
                echo "<h1>Done!</h1><p>Thank you for placing your order</p>";
            }
        }
    }
    
    /**
     * Checks if any of the fields passed via POST are empty
     *
     * @returns true if none of the fields were found to be empty
     */
    function checkPostedFieldContent() {
        $fields = array('shirtColour', 'logoName', 'logoSize', 'hAlign', 'qtySmall', 'qtyMedium', 'qtyLarge', 'qtyXLarge', 'title', 'forename', 'surname', 'email', 'house', 'road', 'city', 'county', 'postcode');
    
        foreach ($fields as $field) {
            if (none($_POST[$field])) {
                echo "<h1>There was a problem...</h1><p>One or more fields were found to be empty when submitting. Please go back using the browser back button and fill in these fields.<p>";
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Checks if the user is a previous customer. If they are, their details are
     * automatically updated and the order is inserted into the database
     *
     * @returns true if the operation succeeded
     */
    function submitToDatabase() {
        /* MySQL connection object */
        $mysqli = new mysqli("xxxxx.xx.xxxx.xx.xx", "xxxxxx", "xxxxxxx", "xxxxxx");

        /* Handle any connection issues */
        if (mysqli_connect_errno()) {
            echo "<h1>There was a problem...</h1><p>Failed to connect to the database.</p>";
            return false;
        }

        $querySelect = "SELECT `cID` FROM `G51WPS_Customers` WHERE cTitle='" . $_POST['title'] . "' AND cForename='" . $_POST['forename'] . "' AND cSurname='" . $_POST['surname'] . "' AND cEmail='" . $_POST['email'] . "' COLLATE utf8_general_ci ORDER by `cID` ASC LIMIT 0, 1";
        $customerId = null;
        
        /* Get the number of rows and current customer information */
        if ($selectCurrentCustomer = $mysqli->prepare($querySelect)) {
            /* Fetch the SELECT data */
            $selectCurrentCustomer->execute();
            $selectCurrentCustomer->bind_result($id);
            $selectCurrentCustomer->store_result();
            $selectCurrentCustomer->fetch();

            /* Store the customer ID and number of rows found */
            $selectNumRows = $selectCurrentCustomer->num_rows;
            $customerId = (selectNumRows == 0) ? $id : null;

            /* Close the query */
            $selectCurrentCustomer->close();
        }

        /* If not a returning customer, insert them into the database. Otherwise, update the existing customer */
        if ($selectNumRows == 0) {
            $queryInsertCustomer = "INSERT INTO `G51WPS_Customers` (`cID`, `cTitle`, `cForename`, `cSurname`, `cEmail`, `cHouse`, `cRoad`, `cStreet`, `cCity`, `cCounty`, `cPostcode`) VALUES (NULL, '" . $_POST['title'] . "', '" . $_POST['forename'] . "', '" . $_POST['surname'] . "', '" . $_POST['email'] . "', '" . $_POST['house'] . "', '" . $_POST['road'] . "', '" . $_POST['street'] . "', '" . $_POST['city'] . "', '" . $_POST['county'] . "', '" . $_POST['postcode'] . "')";

            if ($insertNewCustomer = $mysqli->prepare($queryInsertCustomer)) {
                $insertNewCustomer->execute();
                $customerId = $mysqli->insert_id;
                $insertNewCustomer->close();
            }
        } else {
            $queryUpdate = "UPDATE `G51WPS_Customers` SET `cHouse` = '" . $_POST['house'] . "', `cRoad` = '" . $_POST['road'] . "', `cStreet` = '" . $_POST['street'] . "', `cCity` = '" . $_POST['city'] . "', `cCounty` = '" . $_POST['county'] . "', `cPostcode` = '" . $_POST['postcode'] . "' WHERE `G51WPS_Customers`.`cID` = " . $customerId;

            if ($updateCustomer = $mysqli->prepare($queryUpdate)) {
                $updateCustomer->execute();
                $updateCustomer->close();
            }
        }

        /* Insert the order into the database */
        $queryInsertOrder = "INSERT INTO  `sjf02u`.`G51WPS_Orders` (`oID`, `cID`, `oShirtColour`, `oLogoName`, `oLogoSize`, `oHorizontalAlign`, `oTopText`, `oTopAttributes`, `oBottomText`, `oBottomAttributes`, `oNumSmall`, `oNumMedium`, `oNumLarge`, `oNumXLarge`) VALUES (NULL , '" . $customerId . "', '" . $_POST['shirtColour'] . "', '" . $_POST['logoName'] . "', '" . $_POST['logoSize'] . "', '" . $_POST['hAlign'] . "', '" . $_POST['topText'] . "', '" . $_POST['topAttributes'] . "', '" . $_POST['bottomText'] . "', '" . $_POST['bottomAttributes'] . "', '" . $_POST['qtySmall'] . "', '" . $_POST['qtyMedium'] . "', '" . $_POST['qtyLarge'] . "', '" . $_POST['qtyXLarge'] . "')";

        if ($insertNewOrder = $mysqli->prepare($queryInsertOrder)) {
            $insertNewOrder->execute();
            $insertNewOrder->close();
        }

        /* Close the MySQL connection */
        $mysqli->close();
        return true;
    }
    
    /**
     * Checks if a string is empty
     *
     * @returns true if empty
     */
    function none($str) {
        return ($str == "");
    }
?>
