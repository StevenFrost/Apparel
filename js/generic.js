/**
 * Module:      generic.js
 * Description: This module implements core features for the website
 *              to aid the preparation, navigation and interactivity
 *              of the website.
 *
 * Author:      Steven Frost
 * Website:     Apparel
 */

/**
 * Initialises the HTML5 session storage structure with appropriate data
 */
function initialiseSession() {
    if (typeof(Storage) !== 'undefined') {
        if (sessionStorage.sessionAlive == "true") {
            /* Update shirt elements to reflect session data */
            updateShirt(sessionStorage.shirtColour);
            updateLogo(sessionStorage.logoName);
            updateText();
        } else {
            /* Session status */
            sessionStorage.sessionAlive = true;

            /* Shirt colour */
            sessionStorage.shirtColour = "Grey";

            /* Shirt logo */
            sessionStorage.logoName = "blank";
            sessionStorage.logoSize = "Large";
            sessionStorage.horizontalAlign = "Middle";

            /* Shirt text */
            sessionStorage.topText = "";
            sessionStorage.topAttributes = "Black:Medium:Arial";
            sessionStorage.bottomText = "";
            sessionStorage.bottomAttributes = "Black:Medium:Arial";
            
            /* Order details */
            sessionStorage.qtySmall = 0;
            sessionStorage.qtyMedium = 0;
            sessionStorage.qtyLarge = 0;
            sessionStorage.qtyXLarge = 0;
        }
        resetPersonalDetails();
    } else {
        console.log("Web storage not supported.");
    }
}

/**
 * Resets the personal details stored in the session on page reload
 */
function resetPersonalDetails() {
    var personalDetails = ['title', 'forename', 'surname', 'email', 'house',
                           'road', 'street', 'city', 'county', 'postcode'];
    for (var i = 0; i < personalDetails.length; i++) {
        sessionStorage.setItem(personalDetails[i], '');
    }
}

/**
 * Gets the current selected page by the current address value
 *
 * @example:    http://localhost/#/page -> page
 * @returns:    The page name specified in the URL, 'colour' if not found
 */
function getPageName(rawPageName) {
    if (rawPageName != '#/' && rawPageName != '/' && rawPageName != '' && rawPageName != undefined) {
        var firstChar = rawPageName.charAt(0);

        if (firstChar == '/') {
            return rawPageName.substring(1);
        } else if (firstChar == '#') {
            return rawPageName.substring(2);
        } else {
            return rawPageName;
        }
    } else {
        return 'colour';
    }
}

/**
 * Loads a new page into the #page div
 *
 * @param pageName: the current page name
 */
function changePage(pageName) {
    var page = getPageName(pageName);
    var fileName = page + '.html';
    
    $("#content #page").load(fileName, 'body', function(response, status, XMLHttpRequest) {
        if(status != 'success' && page != 'colour') {
            console.log('The file "' + fileName + '" could not be found. Default page loading...');
            changePage('#/colour');
        } else if (page == 'colour') {
            console.log('The default page could not be loaded.');
        }
    });
    
    configureNavigation(page);
}

/**
 * Configures the specified button upon page load
 *
 * @param tag:      the button ID to modify
 * @param href:     the new link attribute, empty keeps current
 * @param enabled:  true if the control is to be visible
 */
function configureButton(tag, text, href, enabled) {
    var elem = $(tag);
    elem.css('display', enabled ? 'block' : 'none');
    
    if (text != "") {
        elem.text(text);
    }
    
    if (href != "") {
        elem.attr('href', href);
    }
}

/**
 * Configures the nagivation bar based on the current page
 * loaded in the document
 *
 * @param page:     the name of the current page
 */
function configureNavigation(page) {
    $("#navigation li").each(function(index, element) {
        if ($(element).attr('id') == page) {
            $(element).children().attr('class', 'navButtonCurrent');
            currentEncountered = true;
        } else {
            $(element).children().attr('class', 'navButton');
        }
    });
}
http://www.cs.nott.ac.uk/~sjf02u/G51WPS
/**
 * Redirects the user to the details page if a core piece of
 * required information is missing from the session (house)
 */
function redirectOnUndefinedSessionData() {
    if (sessionStorage.house == "") {
        $.address.value('details');
    } else if (sessionStorage.qtySmall == 0 && sessionStorage.qtyMedium == 0 && sessionStorage.qtyLarge == 0 && sessionStorage.qtyXLarge == 0) {
        $.address.value('details');
    }
}

/**
 * Updates the t-shirt image to reflect the selected colour
 *
 * @param colour:   the colour selected by the user
 */
function updateShirt(colour) {
    sessionStorage.shirtColour = colour;
    $("#contentPreview").css('background-image', 'url("images/shirts/shirt' + colour + '.png")');
}

/**
 * Updates the t-shirt logo to reflect the selected thumbnail
 *
 * @param logoName: the logo name
 */
function updateLogo(logoName) {
    var fileName = sessionStorage.logoSize.toLowerCase() + '.png';
    var logoElement = $('#logoImage');
    var top, left;
    
    /* Update session data to reflect the logo change */
    sessionStorage.logoName = logoName;
    
    if (sessionStorage.logoSize == 'Small') {
        top = "95px";
        if (sessionStorage.horizontalAlign == 'Left') {
            left = "70px";
        } else if (sessionStorage.horizontalAlign == 'Middle') {
            left = "127px";
        } else if (sessionStorage.horizontalAlign == 'Right') {
            left = "180px";
        }
    } else if (sessionStorage.logoSize == 'Large') {
        top = "100px";
        left = "105px";
    }
    
    /* Apply logoElement changes */
    logoElement.attr('src', 'images/logos/' + logoName + '/' + fileName);
    logoElement.css('top', top);
    logoElement.css('left', left);
}

/**
 * Updates all the options related to the logo positioning
 */
function updateLogoOptions() {
    $('input[value="' + sessionStorage.logoSize + '"][name="logoSize"]').attr('checked', true);
    $('input[value="' + sessionStorage.horizontalAlign + '"][name="hAlign"]').attr('checked', true);
    
    if ($('input[value="Small"][name="logoSize"]').attr('checked') == "checked") {
        $('#logoAlignment').show();
    } else {
        $('#logoAlignment').hide();
        $('input[value="Middle"][name="hAlign"]').attr('checked', true);
        sessionStorage.horizontalAlign = "Middle";
        updateLogo(sessionStorage.logoName);
    }
}

/**
 * Updates the position of the live-preview text based upon the current logo position
 */
function updateText() {
    var topText = $('#topShirtText');
    var bottomText = $('#bottomShirtText');
    var topAttributes = sessionStorage.topAttributes.split(':');
    var bottomAttributes = sessionStorage.bottomAttributes.split(':');
    
    /* Update the form options related to text */
    updateTextOptions(topAttributes, bottomAttributes);

    /* Live preview styling */
    topText.text(sessionStorage.topText);
    topText.css('color', topAttributes[0]);
    topText.css('font-size', (topAttributes[1] == 'Small') ? '10pt' : (topAttributes[1] == 'Medium') ? '12pt' : '14pt');
    topText.css('font-family', topAttributes[2]);
    bottomText.text(sessionStorage.bottomText);
    bottomText.css('color', bottomAttributes[0]);
    bottomText.css('font-size', (bottomAttributes[1] == 'Small') ? '10pt' : (bottomAttributes[1] == 'Medium') ? '12pt' : '14pt');
    bottomText.css('font-family', bottomAttributes[2]);
    
    if (sessionStorage.logoSize == 'Large') {
        $('#bottomText').show();
        bottomText.show();

        /* Positioning */
        bottomText.css('top', '200px');
        bottomText.css('width', '160px');
        bottomText.css('left', '70px');
        topText.css('top', '70px');
        topText.css('text-align', 'center');
        topText.css('width', '160px');
        topText.css('left', '70px');
    } else {
        if (sessionStorage.horizontalAlign == 'Middle') {
            $('#bottomText').show();
            bottomText.show();

            /* Positioning */
            bottomText.css('top', '145px');
            bottomText.css('width', '160px');
            bottomText.css('left', '70px');
            topText.css('top', '70px');
            topText.css('text-align', 'center');
            topText.css('width', '160px');
            topText.css('left', '70px');
        } else if (sessionStorage.horizontalAlign == 'Left') {
            $('#topText h2').hide();
            $('#bottomText').hide();
            sessionStorage.bottomText = "";
            bottomText.hide();

            /* Positioning */
            topText.css('top', '106px');
            topText.css('text-align', 'left');
            topText.css('width', '104px');
            topText.css('left', '120px');
        } else {
            $('#topText h2').hide();
            $('#bottomText').hide();
            sessionStorage.bottomText = "";
            bottomText.hide();

            /* Positioning */
            topText.css('top', '106px');
            topText.css('text-align', 'right');
            topText.css('width', '104px');
            topText.css('left', '70px');
        }
    }
}

/**
 * Updates the text page options, specifically the values they hold on page load
 */
function updateTextOptions(topAttributes, bottomAttributes) {
    $('#topText input[name="shirtText"]').val(sessionStorage.topText);
    $('#topText select[name="shirtTextColour"]').val(topAttributes[0]);
    $('#topText select[name="shirtTextSize"]').val(topAttributes[1]);
    $('#topText select[name="shirtTextFont"]').val(topAttributes[2]);
    
    $('#bottomText input[name="shirtText"]').val(sessionStorage.bottomText);
    $('#bottomText select[name="shirtTextColour"]').val(bottomAttributes[0]);
    $('#bottomText select[name="shirtTextSize"]').val(bottomAttributes[1]);
    $('#bottomText select[name="shirtTextFont"]').val(bottomAttributes[2]);
}

/**
 * Updates the session storage attributes for t-shirt text, including
 * text, colour, size and font.
 */
function setTextAttributes(isTop, text, colour, size, font) {
    var currentAttributes = isTop ? sessionStorage.topAttributes.split(':') : sessionStorage.bottomAttributes.split(':');
    var result = "";
    
    var userTextEmpty = (colour == "" && size == "" && font == "");
    
    result += ((colour != "") ? colour : currentAttributes[0]) + ':';
    result += ((size != "") ? size : currentAttributes[1]) + ':';
    result += (font != "") ? font : currentAttributes[2];
    
    if (isTop) {
        sessionStorage.topText = userTextEmpty ? text : sessionStorage.topText;
        sessionStorage.topAttributes = result;
    } else {
        sessionStorage.bottomText = userTextEmpty ? text : sessionStorage.bottomText;
        sessionStorage.bottomAttributes = result;
    }
}

/**
 * Limits the number of characters a textbox can hold
 *
 * @param elem the element to limit characters for
 * @param limit the number of characters allowed
 */
function limitTextBoxCharacters(elem, limit) {
    var strLen = elem.value.length;
    if (strLen > limit) {
        elem.value = elem.value.substr(0, limit);
        strLen = limit;
    }
}

/**
 * Validates all session data in the session that the database requires. Data
 * is re-validated on the server before it is inserted into the database
 */
function validateSessionData() {
    var success = true;
    var fields = ['title', 'forename', 'surname', 'email', 'house',
                           'road', 'city', 'county', 'postcode'];
                           
    for (var i = 0; i < fields.length; i++) {
        if ((sessionStorage.getItem(fields[i]) == "") || 
            (fields[i] == 'email' && !validEmail(sessionStorage.getItem(fields[i]))) ||
            (fields[i] == 'postcode' && !validPostcode(sessionStorage.getItem(fields[i])))) {
            /* Colour the field to indicate an error */
            $('.webForm input[name="' + fields[i] + '"]').attr('class', 'error');
            success = false;
        }
    }

    if (sessionStorage.qtySmall == 0 && sessionStorage.qtyMedium == 0 && sessionStorage.qtyLarge == 0 && sessionStorage.qtyXLarge == 0) {
        if ($('#qtyErr').length == 0) {
            $('#orderQuantities').prepend('<div id="qtyErr" class="field">Please select at least one size quantity.</div>');
        }
        success = false;
    } else {
        $('#orderQuantities #qtyErr').remove();
    }
    return success;
}

/**
 * Validates a given email address using a regular expression.
 */
function validEmail(address) {
    var regex = /^[a-zA-Z0-9\.!#$%&'\*+-\/=?\^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/
    return regex.test(address);
}

/**
 * Validates a given postcode using a regular expression
 */
function validPostcode(postcode) {
    var regex = /^(([A-PR-UWYZ]([0-9]{1,2}|([A-HK-Y][0-9]|[A-HK-Y][0-9]([ABEHMNPRV-Y]|[0-9]))|[0-9][A-HJKPS-UW])(\s)*[0-9][ABD-HJLNP-UW-Z]{2})|GIR 0AA)$/;
    return regex.test(postcode.toUpperCase());
}
