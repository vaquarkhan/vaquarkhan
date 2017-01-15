var TTDCM = function() {
    // Creates an iframe for the passed partner_id and url
    // Sets the partner as mapped after the iframe has been created
    function mapPartner( partnerUrl ) {
        var iframeId = "iframe_" + this.mapIndex++;
        var mapIframe = document.createElement( "iframe" );

        mapIframe.setAttribute( "id", iframeId );
        mapIframe.setAttribute( "allowTransparency", true );
        mapIframe.setAttribute( "height", 0 );
        mapIframe.setAttribute( "width", 0 );

        mapIframe.setAttribute( "src", partnerUrl );

        document.body.appendChild( mapIframe );
    }

    this.init = function (u) {
        this.sslOnly = location.protocol == "https:" ? true : false;

        if (u === undefined || u == null || u.length == 0)
            return;

        var mapTotal = u.length;
        this.mapIndex = 0;

        for (var i = 0; i < mapTotal; i++) {
            mapPartner(u[i]);
        }
    }
};
