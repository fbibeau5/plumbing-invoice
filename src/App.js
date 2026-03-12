import { useState, useRef, useCallback, useEffect } from "react";

const PRODUCTS = {"1001":{"code":1001,"dim":"1.5","name":"Coupling","cost":1.0,"sell":1.43,"category":"ROUGH ABS"},"1002":{"code":1002,"dim":"1.5","name":"Coude 90","cost":1.21,"sell":1.73,"category":"ROUGH ABS"},"1003":{"code":1003,"dim":"1.5","name":"Coude 45","cost":1.0,"sell":1.43,"category":"ROUGH ABS"},"1004":{"code":1004,"dim":"1.5","name":"Coude 22.5","cost":1.75,"sell":2.5,"category":"ROUGH ABS"},"1005":{"code":1005,"dim":"1.5","name":"Bushing Reduit 2x 1 1/2","cost":2.0,"sell":2.86,"category":"ROUGH ABS"},"1006":{"code":1006,"dim":"1.5","name":"Coupling Reduit 2x1 1/2","cost":3.0,"sell":4.29,"category":"ROUGH ABS"},"1007":{"code":1007,"dim":"1.5","name":"P-Trap Collée","cost":5.0,"sell":7.14,"category":"ROUGH ABS"},"1008":{"code":1008,"dim":"1.5","name":"Cap Solide","cost":4.0,"sell":5.71,"category":"ROUGH ABS"},"1009":{"code":1009,"dim":"1.5","name":"Adapteur femelle","cost":3.0,"sell":4.29,"category":"ROUGH ABS"},"1010":{"code":1010,"dim":"1.5","name":"Adapteur male","cost":2.5,"sell":3.57,"category":"ROUGH ABS"},"1011":{"code":1011,"dim":"1.5","name":"Clapet","cost":30.0,"sell":42.86,"category":"ROUGH ABS"},"1012":{"code":1012,"dim":"1.5","name":"TY","cost":2.0,"sell":2.86,"category":"ROUGH ABS"},"1013":{"code":1013,"dim":"1.5","name":"Y","cost":2.0,"sell":2.86,"category":"ROUGH ABS"},"1014":{"code":1014,"dim":"1.5","name":"Longueur 12'","cost":23.19,"sell":33.13,"category":"ROUGH ABS"},"1015":{"code":1015,"dim":"2","name":"Coupling","cost":1.15,"sell":1.64,"category":"ROUGH ABS"},"1016":{"code":1016,"dim":"2","name":"Coude 90","cost":2.0,"sell":2.86,"category":"ROUGH ABS"},"1017":{"code":1017,"dim":"2","name":"Coude 45","cost":2.0,"sell":2.86,"category":"ROUGH ABS"},"1018":{"code":1018,"dim":"2","name":"Coude 22.5","cost":3.0,"sell":4.29,"category":"ROUGH ABS"},"1019":{"code":1019,"dim":"2","name":"P-Trap Collée","cost":10.0,"sell":14.29,"category":"ROUGH ABS"},"1020":{"code":1020,"dim":"2","name":"Cap Solide","cost":2.2,"sell":3.14,"category":"ROUGH ABS"},"1021":{"code":1021,"dim":"2","name":"Clean-out","cost":4.0,"sell":5.71,"category":"ROUGH ABS"},"1022":{"code":1022,"dim":"2","name":"Y 2\"","cost":3.9,"sell":5.57,"category":"ROUGH ABS"},"1023":{"code":1023,"dim":"2","name":"Y 2x2x1 1/2","cost":3.66,"sell":5.23,"category":"ROUGH ABS"},"1024":{"code":1024,"dim":"2","name":"Y 2x1 1/2x 1 1/2","cost":4.98,"sell":7.11,"category":"ROUGH ABS"},"1025":{"code":1025,"dim":"2","name":"TY 2\"","cost":4.0,"sell":5.71,"category":"ROUGH ABS"},"1026":{"code":1026,"dim":"2","name":"TY 2x2x1 1/2","cost":3.75,"sell":5.36,"category":"ROUGH ABS"},"1027":{"code":1027,"dim":"2","name":"TY 2x 1 1/2 x 1 1/2","cost":5.0,"sell":7.14,"category":"ROUGH ABS"},"1028":{"code":1028,"dim":"2","name":"Clapet","cost":32.5,"sell":46.43,"category":"ROUGH ABS"},"1029":{"code":1029,"dim":"2","name":"Longueur 12'","cost":32.0,"sell":45.71,"category":"ROUGH ABS"},"1030":{"code":1030,"dim":"2","name":"Drain douche standard","cost":12.5,"sell":17.86,"category":"ROUGH ABS"},"1031":{"code":1031,"dim":"2","name":"Drain douche Sous-Sol","cost":8.9,"sell":12.71,"category":"ROUGH ABS"},"1032":{"code":1032,"dim":"2","name":"Vent Auto","cost":21.0,"sell":30.0,"category":"ROUGH ABS"},"1033":{"code":1033,"dim":"3","name":"Coupling","cost":2.5,"sell":3.57,"category":"ROUGH ABS"},"1034":{"code":1034,"dim":"3","name":"Coude 90","cost":4.53,"sell":6.47,"category":"ROUGH ABS"},"1035":{"code":1035,"dim":"3","name":"Coude 45","cost":4.0,"sell":5.71,"category":"ROUGH ABS"},"1036":{"code":1036,"dim":"3","name":"Coude 22.5","cost":6.0,"sell":8.57,"category":"ROUGH ABS"},"1037":{"code":1037,"dim":"3","name":"P-Trap Collée","cost":25.0,"sell":35.71,"category":"ROUGH ABS"},"1038":{"code":1038,"dim":"3","name":"Cap Solide","cost":9.0,"sell":12.86,"category":"ROUGH ABS"},"1039":{"code":1039,"dim":"3","name":"Clean-Out","cost":15.0,"sell":21.43,"category":"ROUGH ABS"},"1040":{"code":1040,"dim":"3","name":"Y 3","cost":7.5,"sell":10.71,"category":"ROUGH ABS"},"1041":{"code":1041,"dim":"3","name":"Y 3x2","cost":7.0,"sell":10.0,"category":"ROUGH ABS"},"1042":{"code":1042,"dim":"3","name":"Y 3x1 1/2","cost":6.0,"sell":8.57,"category":"ROUGH ABS"},"1043":{"code":1043,"dim":"3","name":"TY 3x 1 1/2","cost":6.0,"sell":8.57,"category":"ROUGH ABS"},"1044":{"code":1044,"dim":"3","name":"TY 3x2","cost":11.0,"sell":15.71,"category":"ROUGH ABS"},"1045":{"code":1045,"dim":"3","name":"TY 3","cost":8.0,"sell":11.43,"category":"ROUGH ABS"},"1046":{"code":1046,"dim":"3","name":"Clapet","cost":32.0,"sell":45.71,"category":"ROUGH ABS"},"1047":{"code":1047,"dim":"3","name":"Longueur 12'","cost":69.46,"sell":99.23,"category":"ROUGH ABS"},"1048":{"code":1048,"dim":"n/a","name":"Flange standard","cost":8.5,"sell":12.14,"category":"ROUGH ABS"},"1049":{"code":1049,"dim":"n/a","name":"Flange fit","cost":8.5,"sell":12.14,"category":"ROUGH ABS"},"1050":{"code":1050,"dim":"n/a","name":"Plomb de toilette 4x3x10","cost":43.0,"sell":61.43,"category":"ROUGH ABS"},"1051":{"code":1051,"dim":"2","name":"Boite Laveuse","cost":50.0,"sell":71.43,"category":"ROUGH ABS"},"1052":{"code":1052,"dim":"2","name":"Boite Laveuse Antibélier","cost":70.0,"sell":100.0,"category":"ROUGH ABS"},"1053":{"code":1053,"dim":"1.5","name":"Drain Bain autoportant 123","cost":140.0,"sell":164.71,"category":"FINITION"},"1054":{"code":1054,"dim":"ABS 4\"","name":"Coupling","cost":5.0,"sell":7.14,"category":"ROUGH ABS"},"1055":{"code":1055,"dim":"ABS 4\"","name":"Coude 90","cost":11.5,"sell":16.43,"category":"ROUGH ABS"},"1056":{"code":1056,"dim":"ABS 4\"","name":"Coude 45","cost":10.0,"sell":14.29,"category":"ROUGH ABS"},"1057":{"code":1057,"dim":"ABS 4\"","name":"Coude 22.5","cost":12.0,"sell":17.14,"category":"ROUGH ABS"},"1058":{"code":1058,"dim":"ABS 4\"","name":"Y","cost":22.0,"sell":31.43,"category":"ROUGH ABS"},"1059":{"code":1059,"dim":"ABS 4\"","name":"TY","cost":21.0,"sell":30.0,"category":"ROUGH ABS"},"1060":{"code":1060,"dim":"ABS 4\"","name":"TY 4X3","cost":21.0,"sell":30.0,"category":"ROUGH ABS"},"1061":{"code":1061,"dim":"ABS 4\"","name":"Y 4x2","cost":16.0,"sell":22.86,"category":"ROUGH ABS"},"1062":{"code":1062,"dim":"ABS 4\"","name":"Y 4x4x3","cost":18.0,"sell":25.71,"category":"ROUGH ABS"},"1063":{"code":1063,"dim":"ABS 4\"","name":"4X3 Bushin","cost":10.0,"sell":14.29,"category":"ROUGH ABS"},"1064":{"code":1064,"dim":"ABS 4\"","name":"Tuyau 12'","cost":96.0,"sell":137.14,"category":"ROUGH ABS"},"1067":{"code":1067,"dim":"1.5","name":"Fernco","cost":10.0,"sell":12.5,"category":"FOND DE TERRE"},"1068":{"code":1068,"dim":"2","name":"Fernco","cost":15.0,"sell":18.75,"category":"FOND DE TERRE"},"1069":{"code":1069,"dim":"3","name":"Fernco","cost":20.0,"sell":25.0,"category":"FOND DE TERRE"},"1070":{"code":1070,"dim":"4","name":"Fernco","cost":25.0,"sell":31.25,"category":"FOND DE TERRE"},"1071":{"code":1071,"dim":"5x4","name":"Fernco","cost":30.0,"sell":37.5,"category":"FOND DE TERRE"},"1072":{"code":1072,"dim":"6x4","name":"Fernco","cost":35.0,"sell":43.75,"category":"FOND DE TERRE"},"1078":{"code":1078,"dim":"n/a","name":"Laine isolante tuyauterie 12pox48po","cost":5.0,"sell":7.14,"category":"ROUGH ABS"},"1079":{"code":1079,"dim":"n/a","name":"Braquette Metallique Ajustable","cost":15.0,"sell":21.43,"category":"ROUGH ABS"},"1080":{"code":1080,"dim":"n/a","name":"Roulette Feuillard","cost":8.0,"sell":11.43,"category":"ROUGH ABS"},"1081":{"code":1081,"dim":"n/a","name":"Canne Urethane","cost":12.0,"sell":17.14,"category":"ROUGH ABS"},"1082":{"code":1082,"dim":"n/a","name":"Gros Tube PL","cost":19.0,"sell":27.14,"category":"ROUGH ABS"},"1083":{"code":1083,"dim":"1.5","name":"Overflow Bain Canplas","cost":30.0,"sell":42.86,"category":"ROUGH ABS"},"1084":{"code":1084,"dim":"1.5","name":"Overflow Bain Rubi","cost":60.0,"sell":70.59,"category":"FINITION"},"1085":{"code":1085,"dim":"ABS 4\"","name":"Regard de nettoyage","cost":20.0,"sell":28.57,"category":"ROUGH ABS"},"1086":{"code":1086,"dim":"3","name":"Clapet Compression Rubber","cost":25.0,"sell":29.41,"category":"FINITION"},"1087":{"code":1087,"dim":"4","name":"Clapet Compression Rubber","cost":30.0,"sell":35.29,"category":"FINITION"},"2001":{"code":2001,"dim":"Demi","name":"Coude 90","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2002":{"code":2002,"dim":"Demi","name":"T","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2003":{"code":2003,"dim":"Demi","name":"Coupling","cost":1.15,"sell":1.64,"category":"ROUGH PEX"},"2004":{"code":2004,"dim":"Demi","name":"Cap","cost":0.75,"sell":1.07,"category":"ROUGH PEX"},"2005":{"code":2005,"dim":"Demi","name":"Coude Oreille","cost":5.15,"sell":7.36,"category":"ROUGH PEX"},"2006":{"code":2006,"dim":"Demi","name":"Adapteur Mâle","cost":2.25,"sell":3.21,"category":"ROUGH PEX"},"2007":{"code":2007,"dim":"Demi","name":"Adapteur Femelle","cost":1.75,"sell":2.5,"category":"ROUGH PEX"},"2008":{"code":2008,"dim":"Demi","name":"Adapteur soudé","cost":1.0,"sell":1.43,"category":"ROUGH PEX"},"2009":{"code":2009,"dim":"Demi","name":"Adapt. Chauffe-eau","cost":3.9,"sell":5.57,"category":"ROUGH PEX"},"2010":{"code":2010,"dim":"Demi","name":"Bague","cost":0.25,"sell":0.36,"category":"ROUGH PEX"},"2011":{"code":2011,"dim":"Demi","name":"J-Clip","cost":0.16,"sell":0.23,"category":"ROUGH PEX"},"2012":{"code":2012,"dim":"Demi","name":"Ball Valve","cost":12.0,"sell":17.14,"category":"ROUGH PEX"},"2013":{"code":2013,"dim":"Demi","name":"Tuyau 10'","cost":5.0,"sell":7.14,"category":"ROUGH PEX"},"2014":{"code":2014,"dim":"Trois-Quart","name":"Coude 90","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2015":{"code":2015,"dim":"Trois-Quart","name":"T","cost":2.75,"sell":3.93,"category":"ROUGH PEX"},"2016":{"code":2016,"dim":"Trois-Quart","name":"T 3/4 x 1/2","cost":2.95,"sell":4.21,"category":"ROUGH PEX"},"2017":{"code":2017,"dim":"Trois-Quart","name":"T 3/4 X 1/2 X 1/2","cost":3.75,"sell":5.36,"category":"ROUGH PEX"},"2018":{"code":2018,"dim":"Trois-Quart","name":"Coupling","cost":1.75,"sell":2.5,"category":"ROUGH PEX"},"2019":{"code":2019,"dim":"Trois-Quart","name":"Cap","cost":1.75,"sell":2.5,"category":"ROUGH PEX"},"2020":{"code":2020,"dim":"Trois-Quart","name":"Reduit 3/4 x 1/2","cost":1.9,"sell":2.71,"category":"ROUGH PEX"},"2021":{"code":2021,"dim":"Trois-Quart","name":"Adapt. Chauffe-eau","cost":5.0,"sell":7.14,"category":"ROUGH PEX"},"2022":{"code":2022,"dim":"Trois-Quart","name":"Bague","cost":0.3,"sell":0.43,"category":"ROUGH PEX"},"2023":{"code":2023,"dim":"Trois-Quart","name":"J-Clip","cost":0.3,"sell":0.43,"category":"ROUGH PEX"},"2024":{"code":2024,"dim":"Trois-Quart","name":"Ball Valve","cost":13.5,"sell":19.29,"category":"ROUGH PEX"},"2025":{"code":2025,"dim":"Trois-Quart","name":"Adapt. Soudé","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2026":{"code":2026,"dim":"Trois-Quart","name":"Tuyau 10'","cost":7.0,"sell":10.0,"category":"ROUGH PEX"},"2027":{"code":2027,"dim":"n/a","name":"Boite Valve Eau Frigo","cost":40.0,"sell":57.14,"category":"ROUGH PEX"},"2028":{"code":2028,"dim":"n/a","name":"Sortie eau ball valve","cost":45.0,"sell":64.29,"category":"ROUGH PEX"},"2029":{"code":2029,"dim":"n/a","name":"Sortie eau regulière","cost":28.0,"sell":40.0,"category":"ROUGH PEX"},"2030":{"code":2030,"dim":"Demi","name":"Coude 90 UPONOR","cost":2.0,"sell":2.86,"category":"ROUGH PEX"},"2031":{"code":2031,"dim":"Demi","name":"T UPONOR","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2032":{"code":2032,"dim":"Demi","name":"Coupling UPONOR","cost":1.75,"sell":2.5,"category":"ROUGH PEX"},"2033":{"code":2033,"dim":"Demi","name":"Cap UPONOR","cost":1.2,"sell":1.71,"category":"ROUGH PEX"},"2034":{"code":2034,"dim":"Demi","name":"Coude Oreille UPONOR","cost":13.5,"sell":19.29,"category":"ROUGH PEX"},"2035":{"code":2035,"dim":"Demi","name":"Adapteur Mâle UPONOR","cost":5.12,"sell":7.31,"category":"ROUGH PEX"},"2036":{"code":2036,"dim":"Demi","name":"Adapteur Femelle UPONOR","cost":11.7,"sell":16.71,"category":"ROUGH PEX"},"2037":{"code":2037,"dim":"Demi","name":"Adapteur soudé UPONOR","cost":4.0,"sell":5.71,"category":"ROUGH PEX"},"2038":{"code":2038,"dim":"Demi","name":"Adapt. Chauffe-eau UPONOR","cost":16.0,"sell":22.86,"category":"ROUGH PEX"},"2039":{"code":2039,"dim":"Demi","name":"Bague UPONOR","cost":0.5,"sell":0.71,"category":"ROUGH PEX"},"2040":{"code":2040,"dim":"Demi","name":"Ball Valve UPONOR","cost":11.0,"sell":15.71,"category":"ROUGH PEX"},"2041":{"code":2041,"dim":"Demi","name":"Tuyau 20' UPONOR","cost":11.0,"sell":15.71,"category":"ROUGH PEX"},"2042":{"code":2042,"dim":"Trois-Quart","name":"Coude 90 UPONOR","cost":3.75,"sell":5.36,"category":"ROUGH PEX"},"2043":{"code":2043,"dim":"Trois-Quart","name":"T UPONOR","cost":5.0,"sell":7.14,"category":"ROUGH PEX"},"2044":{"code":2044,"dim":"Trois-Quart","name":"T 3/4 x 1/2 UPONOR","cost":4.0,"sell":5.71,"category":"ROUGH PEX"},"2045":{"code":2045,"dim":"Trois-Quart","name":"T 3/4 X 1/2 X 1/2 UPONOR","cost":3.5,"sell":5.0,"category":"ROUGH PEX"},"2046":{"code":2046,"dim":"Trois-Quart","name":"Coupling UPONOR","cost":2.5,"sell":3.57,"category":"ROUGH PEX"},"2047":{"code":2047,"dim":"Trois-Quart","name":"Cap UPONOR","cost":2.0,"sell":2.86,"category":"ROUGH PEX"},"2048":{"code":2048,"dim":"Trois-Quart","name":"Reduit 3/4 x 1/2 UPONOR","cost":5.5,"sell":7.86,"category":"ROUGH PEX"},"2049":{"code":2049,"dim":"Trois-Quart","name":"Adapt. Chauffe-eau UPONOR","cost":12.0,"sell":17.14,"category":"ROUGH PEX"},"2050":{"code":2050,"dim":"Trois-Quart","name":"Bague UPONOR","cost":0.5,"sell":0.71,"category":"ROUGH PEX"},"2051":{"code":2051,"dim":"Trois-Quart","name":"Ball Valve UPONOR","cost":20.0,"sell":28.57,"category":"ROUGH PEX"},"2052":{"code":2052,"dim":"Trois-Quart","name":"Adapt. Soudé UPONOR","cost":8.8,"sell":12.57,"category":"ROUGH PEX"},"2053":{"code":2053,"dim":"Trois-Quart","name":"Tuyau 20' UPONOR","cost":23.38,"sell":33.4,"category":"ROUGH PEX"},"2054":{"code":2054,"dim":"POUCE","name":"Coude 90 UPONOR","cost":7.25,"sell":10.36,"category":"ROUGH PEX"},"2055":{"code":2055,"dim":"POUCE","name":"T UPONOR","cost":10.75,"sell":15.36,"category":"ROUGH PEX"},"2056":{"code":2056,"dim":"POUCE","name":"T 1 x 1 x 3/4 UPONOR","cost":10.25,"sell":14.64,"category":"ROUGH PEX"},"2057":{"code":2057,"dim":"POUCE","name":"T 1 x 3/4 x 3/4 UPONOR","cost":10.0,"sell":14.29,"category":"ROUGH PEX"},"2058":{"code":2058,"dim":"POUCE","name":"Coupling UPONOR","cost":4.0,"sell":5.71,"category":"ROUGH PEX"},"2059":{"code":2059,"dim":"POUCE","name":"Cap UPONOR","cost":3.5,"sell":5.0,"category":"ROUGH PEX"},"2060":{"code":2060,"dim":"POUCE","name":"Reduit 1  x 3/4 UPONOR","cost":7.5,"sell":10.71,"category":"ROUGH PEX"},"2061":{"code":2061,"dim":"POUCE","name":"Adapteur Femelle UPONOR","cost":25.0,"sell":35.71,"category":"ROUGH PEX"},"2062":{"code":2062,"dim":"POUCE","name":"Bague UPONOR","cost":1.41,"sell":2.01,"category":"ROUGH PEX"},"2063":{"code":2063,"dim":"POUCE","name":"J-Clip UPONOR","cost":0.25,"sell":0.36,"category":"ROUGH PEX"},"2064":{"code":2064,"dim":"POUCE","name":"Ball Valve UPONOR","cost":25.0,"sell":35.71,"category":"ROUGH PEX"},"2065":{"code":2065,"dim":"POUCE","name":"Adapt. Soudé UPONOR","cost":14.0,"sell":20.0,"category":"ROUGH PEX"},"2066":{"code":2066,"dim":"POUCE","name":"Adapteur Mâle UPONOR","cost":25.0,"sell":35.71,"category":"ROUGH PEX"},"2067":{"code":2067,"dim":"POUCE","name":"Tuyau 20' UPONOR","cost":38.0,"sell":54.29,"category":"ROUGH PEX"},"2068":{"code":2068,"dim":"Demi","name":"Coude 90 PROPRESS","cost":5.0,"sell":7.14,"category":"ROUGH PEX"},"2069":{"code":2069,"dim":"Demi","name":"T PROPRESS","cost":7.0,"sell":10.0,"category":"ROUGH PEX"},"2071":{"code":2071,"dim":"Demi","name":"Coupling PROPRESS","cost":4.0,"sell":5.71,"category":"ROUGH PEX"},"2072":{"code":2072,"dim":"Demi","name":"Cap PROPRESS","cost":7.0,"sell":10.0,"category":"ROUGH PEX"},"2073":{"code":2073,"dim":"Demi","name":"Coude Oreille PROPRESS","cost":15.0,"sell":21.43,"category":"ROUGH PEX"},"2074":{"code":2074,"dim":"Demi","name":"Adapteur Mâle PROPRESS","cost":6.0,"sell":8.57,"category":"ROUGH PEX"},"2075":{"code":2075,"dim":"Demi","name":"Adapteur Femelle PROPRESS","cost":9.0,"sell":12.86,"category":"ROUGH PEX"},"2076":{"code":2076,"dim":"Demi","name":"Adapteur PEX x PROPRESS","cost":13.0,"sell":18.57,"category":"ROUGH PEX"},"2077":{"code":2077,"dim":"Demi","name":"Adapt. Chauffe-eau PROPRESS","cost":19.0,"sell":27.14,"category":"ROUGH PEX"},"2078":{"code":2078,"dim":"Demi","name":"Adapt UPONORxPROPRESS","cost":10.0,"sell":14.29,"category":"ROUGH PEX"},"2079":{"code":2079,"dim":"Demi","name":"Support Cloué COP","cost":0.3,"sell":0.43,"category":"ROUGH PEX"},"2080":{"code":2080,"dim":"Demi","name":"Ball Valve PROPRESS","cost":25.0,"sell":35.71,"category":"ROUGH PEX"},"2081":{"code":2081,"dim":"Demi","name":"Tuyau 10' COP","cost":25.16,"sell":35.94,"category":"ROUGH PEX"},"2082":{"code":2082,"dim":"Trois-Quart","name":"Coude 90 PROPRESS","cost":7.25,"sell":10.36,"category":"ROUGH PEX"},"2083":{"code":2083,"dim":"Trois-Quart","name":"T PROPRESS","cost":12.0,"sell":17.14,"category":"ROUGH PEX"},"2084":{"code":2084,"dim":"Trois-Quart","name":"T 3/4 x 1/2 PROPRESS","cost":11.0,"sell":15.71,"category":"ROUGH PEX"},"2085":{"code":2085,"dim":"Trois-Quart","name":"T 3/4 X 1/2 X 1/2 PROPRESS","cost":10.25,"sell":14.64,"category":"ROUGH PEX"},"2086":{"code":2086,"dim":"Trois-Quart","name":"Coupling PROPRESS","cost":6.0,"sell":8.57,"category":"ROUGH PEX"},"2087":{"code":2087,"dim":"Trois-Quart","name":"Cap PROPRESS","cost":11.75,"sell":16.79,"category":"ROUGH PEX"},"2088":{"code":2088,"dim":"Trois-Quart","name":"Reduit 3/4 x 1/2 PROPRESS","cost":5.0,"sell":7.14,"category":"ROUGH PEX"},"2089":{"code":2089,"dim":"Trois-Quart","name":"Adapt. Chauffe-eau PROPRESS","cost":16.0,"sell":22.86,"category":"ROUGH PEX"},"2090":{"code":2090,"dim":"Trois-Quart","name":"Ball Valve PROPRESS","cost":30.0,"sell":42.86,"category":"ROUGH PEX"},"2091":{"code":2091,"dim":"Trois-Quart","name":"Adapt. UPONORxPROPRESS","cost":12.0,"sell":17.14,"category":"ROUGH PEX"},"2092":{"code":2092,"dim":"Trois-Quart","name":"Tuyau 10' COP","cost":65.0,"sell":92.86,"category":"ROUGH PEX"},"2093":{"code":2093,"dim":"Demi","name":"Coupling UPONOR","cost":2.0,"sell":2.86,"category":"ROUGH PEX"},"2094":{"code":2094,"dim":"Demi","name":"Antibélier UPONOR","cost":18.0,"sell":25.71,"category":"ROUGH PEX"},"2095":{"code":2095,"dim":"Demi","name":"Robinet de purge","cost":10.0,"sell":14.29,"category":"ROUGH PEX"},"2096":{"code":2096,"dim":"Demi","name":"Antibélier uponor A","cost":28.0,"sell":40.0,"category":"ROUGH PEX"},"3001":{"code":3001,"dim":"BNQ 4''","name":"TY","cost":5.5,"sell":6.88,"category":"FOND DE TERRE"},"3002":{"code":3002,"dim":"BNQ 4''","name":"4X3","cost":5.75,"sell":7.19,"category":"FOND DE TERRE"},"3003":{"code":3003,"dim":"BNQ 4''","name":"4X2 bushin","cost":4.25,"sell":5.31,"category":"FOND DE TERRE"},"3004":{"code":3004,"dim":"BNQ 4''","name":"45 Fit","cost":2.25,"sell":2.81,"category":"FOND DE TERRE"},"3005":{"code":3005,"dim":"BNQ 4''","name":"4X3 Bushin","cost":3.5,"sell":4.38,"category":"FOND DE TERRE"},"3006":{"code":3006,"dim":"BNQ 4''","name":"Tuyau 10'","cost":32.0,"sell":40.0,"category":"FOND DE TERRE"},"3007":{"code":3007,"dim":"18x24","name":"Bassin Sump Pump","cost":150.0,"sell":187.5,"category":"FOND DE TERRE"},"3008":{"code":3008,"dim":"18x24","name":"Couvercle Bassin Garage","cost":75.0,"sell":93.75,"category":"FOND DE TERRE"},"3009":{"code":3009,"dim":"18x24","name":"Couvercle Scellé","cost":80.0,"sell":100.0,"category":"FOND DE TERRE"},"3010":{"code":3010,"dim":"12x12","name":"Frost Pit avec Couvercle","cost":100.0,"sell":125.0,"category":"FOND DE TERRE"},"3011":{"code":3011,"dim":"Colle","name":"Gallon Colle BNQ","cost":60.0,"sell":75.0,"category":"FOND DE TERRE"},"3012":{"code":3012,"dim":"Colle","name":"Gallon Colle Abs","cost":60.0,"sell":75.0,"category":"FOND DE TERRE"},"3013":{"code":3013,"dim":"Trois-Quart","name":"Cop Molle 1 pieds","cost":12.0,"sell":15.0,"category":"FOND DE TERRE"},"3014":{"code":3014,"dim":"Trois-Quart","name":"Union Corporation","cost":35.0,"sell":43.75,"category":"FOND DE TERRE"},"3015":{"code":3015,"dim":"1.5","name":"Pompe 1/2 HP","cost":300.0,"sell":375.0,"category":"FOND DE TERRE"},"3016":{"code":3016,"dim":"1.5","name":"Pompe 1/2 HP ZOELLER","cost":400.0,"sell":500.0,"category":"FOND DE TERRE"},"3017":{"code":3017,"dim":"1.5","name":"Clapet Pompe","cost":25.0,"sell":31.25,"category":"FOND DE TERRE"},"3018":{"code":3018,"dim":"n/a","name":"Tube Ciment Plastique (pitch)","cost":7.5,"sell":9.38,"category":"FOND DE TERRE"},"3019":{"code":3019,"dim":"1.25","name":"Tuyau Evacuation Pompe Flex","cost":25.0,"sell":31.25,"category":"FOND DE TERRE"},"3020":{"code":3020,"dim":"1.5","name":"Pompe Liberty SJ10","cost":375.0,"sell":468.75,"category":"FOND DE TERRE"},"3021":{"code":3021,"dim":"BNQ 4''","name":"Coupling","cost":7.0,"sell":8.75,"category":"FOND DE TERRE"},"3022":{"code":3022,"dim":"BNQ 4''","name":"Coude 90","cost":15.0,"sell":18.75,"category":"FOND DE TERRE"},"3023":{"code":3023,"dim":"BNQ 4''","name":"Coude 45","cost":8.0,"sell":10.0,"category":"FOND DE TERRE"},"3024":{"code":3024,"dim":"BNQ 4''","name":"Coude 22.5","cost":8.69,"sell":10.86,"category":"FOND DE TERRE"},"3025":{"code":3025,"dim":"BNQ 4''","name":"Y","cost":12.5,"sell":15.62,"category":"FOND DE TERRE"},"3026":{"code":3026,"dim":"BNQ 4''","name":"TY","cost":15.0,"sell":18.75,"category":"FOND DE TERRE"},"3027":{"code":3027,"dim":"BNQ 4''","name":"P-Trap Collée","cost":30.0,"sell":37.5,"category":"FOND DE TERRE"},"3028":{"code":3028,"dim":"BNQ 4''","name":"Regard de nettoyage","cost":8.0,"sell":10.0,"category":"FOND DE TERRE"},"3029":{"code":3029,"dim":"BNQ 4''","name":"4X2 bushin","cost":10.0,"sell":12.5,"category":"FOND DE TERRE"},"3030":{"code":3030,"dim":"BNQ 4''","name":"45 Fit","cost":7.5,"sell":9.38,"category":"FOND DE TERRE"},"3031":{"code":3031,"dim":"BNQ 4''","name":"4X3 Bushin","cost":11.0,"sell":13.75,"category":"FOND DE TERRE"},"3032":{"code":3032,"dim":"BNQ 4''","name":"Tuyau 10'","cost":32.0,"sell":40.0,"category":"FOND DE TERRE"},"3033":{"code":3033,"dim":"3","name":"Capuchon FONTE","cost":11.75,"sell":14.69,"category":"FOND DE TERRE"},"3034":{"code":3034,"dim":"3","name":"Y FONTE","cost":19.0,"sell":23.75,"category":"FOND DE TERRE"},"3035":{"code":3035,"dim":"3","name":"TY FONTE","cost":19.0,"sell":23.75,"category":"FOND DE TERRE"},"3036":{"code":3036,"dim":"3","name":"Coude 45 FONTE","cost":11.0,"sell":13.75,"category":"FOND DE TERRE"},"3037":{"code":3037,"dim":"3","name":"Coude 90 FONTE","cost":13.0,"sell":16.25,"category":"FOND DE TERRE"},"3038":{"code":3038,"dim":"3","name":"Y 3x2 FONTE","cost":18.0,"sell":22.5,"category":"FOND DE TERRE"},"3039":{"code":3039,"dim":"3","name":"FERRULE FONTE","cost":18.0,"sell":22.5,"category":"FOND DE TERRE"},"3040":{"code":3040,"dim":"2","name":"FERRULE FONTE","cost":6.0,"sell":7.5,"category":"FOND DE TERRE"},"3041":{"code":3041,"dim":"2","name":"COLLET MJ","cost":4.5,"sell":5.62,"category":"FOND DE TERRE"},"3042":{"code":3042,"dim":"3","name":"COLLET MJ","cost":10.0,"sell":12.5,"category":"FOND DE TERRE"},"3043":{"code":3043,"dim":"3","name":"Longueur 10'","cost":80.0,"sell":100.0,"category":"FOND DE TERRE"},"3044":{"code":3044,"dim":"1","name":"union Corporation","cost":45.39,"sell":56.74,"category":"FOND DE TERRE"},"3045":{"code":3045,"dim":"1","name":"cuivre molle 1 pied","cost":11.0,"sell":13.75,"category":"FOND DE TERRE"},"3046":{"code":3046,"dim":"18x24","name":"Bassin Garage","cost":100.0,"sell":125.0,"category":"FOND DE TERRE"},"3047":{"code":3047,"dim":"","name":"P trap chromé","cost":25.0,"sell":31.25,"category":"FOND DE TERRE"},"3048":{"code":3048,"dim":"4","name":"FERRULE FONTE","cost":17.5,"sell":21.88,"category":"FOND DE TERRE"},"3049":{"code":3049,"dim":"4","name":"COLLET MJ","cost":8.5,"sell":10.62,"category":"FOND DE TERRE"},"3050":{"code":3050,"dim":"1.5","name":"Coupling PVC","cost":2.87,"sell":3.59,"category":"FOND DE TERRE"},"3051":{"code":3051,"dim":"1.5","name":"Coude 90 PVC","cost":4.33,"sell":5.41,"category":"FOND DE TERRE"},"3052":{"code":3052,"dim":"1.5","name":"Coude 45 PVC","cost":3.64,"sell":4.55,"category":"FOND DE TERRE"},"3053":{"code":3053,"dim":"1.5","name":"Coude 22.5 PVC","cost":5.78,"sell":7.22,"category":"FOND DE TERRE"},"3054":{"code":3054,"dim":"1.5","name":"Bushing Reduit 2x 1 1/2 PVC","cost":3.25,"sell":4.06,"category":"FOND DE TERRE"},"3055":{"code":3055,"dim":"1.5","name":"Coupling Reduit 2x1 1/2 PVC","cost":6.18,"sell":7.72,"category":"FOND DE TERRE"},"3056":{"code":3056,"dim":"1.5","name":"P-Trap Collée PVC","cost":15.09,"sell":18.86,"category":"FOND DE TERRE"},"3057":{"code":3057,"dim":"1.5","name":"Cap Solide PVC","cost":5.5,"sell":6.88,"category":"FOND DE TERRE"},"3058":{"code":3058,"dim":"1.5","name":"Adapteur femelle PVC","cost":4.45,"sell":5.56,"category":"FOND DE TERRE"},"3059":{"code":3059,"dim":"1.5","name":"Adapteur male PVC","cost":3.67,"sell":4.59,"category":"FOND DE TERRE"},"3060":{"code":3060,"dim":"1.5","name":"Clapet PVC","cost":40.5,"sell":50.62,"category":"FOND DE TERRE"},"3061":{"code":3061,"dim":"1.5","name":"TY PVC","cost":6.26,"sell":7.82,"category":"FOND DE TERRE"},"3062":{"code":3062,"dim":"1.5","name":"Y PVC","cost":7.43,"sell":9.29,"category":"FOND DE TERRE"},"3063":{"code":3063,"dim":"1.5","name":"Longueur 12' PVC","cost":42.28,"sell":52.85,"category":"FOND DE TERRE"},"3064":{"code":3064,"dim":"2","name":"Coupling PVC","cost":4.17,"sell":5.21,"category":"FOND DE TERRE"},"3065":{"code":3065,"dim":"2","name":"Coude 90 PVC","cost":6.4,"sell":8.0,"category":"FOND DE TERRE"},"3066":{"code":3066,"dim":"2","name":"Coude 45 PVC","cost":5.41,"sell":6.76,"category":"FOND DE TERRE"},"3067":{"code":3067,"dim":"2","name":"Coude 22.5 PVC","cost":10.22,"sell":12.78,"category":"FOND DE TERRE"},"3068":{"code":3068,"dim":"2","name":"P-Trap Collée PVC","cost":25.0,"sell":31.25,"category":"FOND DE TERRE"},"3069":{"code":3069,"dim":"2","name":"Cap Solide PVC","cost":10.0,"sell":12.5,"category":"FOND DE TERRE"},"3070":{"code":3070,"dim":"2","name":"Clean-out PVC","cost":13.19,"sell":16.49,"category":"FOND DE TERRE"},"3071":{"code":3071,"dim":"2","name":"Y 2\" PVC","cost":13.48,"sell":16.85,"category":"FOND DE TERRE"},"3072":{"code":3072,"dim":"2","name":"Y 2x2x1 1/2 PVC","cost":12.63,"sell":15.79,"category":"FOND DE TERRE"},"3073":{"code":3073,"dim":"2","name":"Y 2x1 1/2x 1 1/2 PVC","cost":14.19,"sell":17.74,"category":"FOND DE TERRE"},"3074":{"code":3074,"dim":"2","name":"TY 2\" PVC","cost":12.16,"sell":15.2,"category":"FOND DE TERRE"},"3075":{"code":3075,"dim":"2","name":"TY 2x2x1 1/2 PVC","cost":9.61,"sell":12.01,"category":"FOND DE TERRE"},"3076":{"code":3076,"dim":"2","name":"TY 2x 1 1/2 x 1 1/2 PVC","cost":9.99,"sell":12.49,"category":"FOND DE TERRE"},"3077":{"code":3077,"dim":"2","name":"Clapet PVC","cost":50.0,"sell":62.5,"category":"FOND DE TERRE"},"3078":{"code":3078,"dim":"2","name":"Longueur 12' PVC","cost":57.18,"sell":71.47,"category":"FOND DE TERRE"},"3079":{"code":3079,"dim":"3","name":"Coupling PVC","cost":8.63,"sell":10.79,"category":"FOND DE TERRE"},"3080":{"code":3080,"dim":"3","name":"Coude 90 PVC","cost":17.14,"sell":21.43,"category":"FOND DE TERRE"},"3081":{"code":3081,"dim":"3","name":"Coude 45 PVC","cost":14.46,"sell":18.07,"category":"FOND DE TERRE"},"3082":{"code":3082,"dim":"3","name":"Coude 22.5 PVC","cost":21.57,"sell":26.96,"category":"FOND DE TERRE"},"3083":{"code":3083,"dim":"3","name":"P-Trap Collée PVC","cost":35.0,"sell":43.75,"category":"FOND DE TERRE"},"3084":{"code":3084,"dim":"3","name":"Cap Solide PVC","cost":20.0,"sell":25.0,"category":"FOND DE TERRE"},"3085":{"code":3085,"dim":"3","name":"Clean-out PVC","cost":35.0,"sell":43.75,"category":"FOND DE TERRE"},"3086":{"code":3086,"dim":"3","name":"Y 3 PVC","cost":27.28,"sell":34.1,"category":"FOND DE TERRE"},"3087":{"code":3087,"dim":"3","name":"Y 3x2 PVC","cost":22.28,"sell":27.85,"category":"FOND DE TERRE"},"3088":{"code":3088,"dim":"3","name":"Y 3x1 1/2 PVC","cost":20.16,"sell":25.2,"category":"FOND DE TERRE"},"3089":{"code":3089,"dim":"3","name":"Clapet PVC","cost":70.0,"sell":87.5,"category":"FOND DE TERRE"},"3090":{"code":3090,"dim":"3","name":"Longueur 12' PVC","cost":114.81,"sell":143.51,"category":"FOND DE TERRE"},"3091":{"code":3091,"dim":"4","name":"Y 4x4x3 FONTE","cost":35.0,"sell":43.75,"category":"FOND DE TERRE"},"4007":{"code":4007,"dim":"1 1\\2","name":"Trap adapt","cost":3.5,"sell":4.12,"category":"FINITION"},"4008":{"code":4008,"dim":"1 1\\4","name":"Trap adapt","cost":3.75,"sell":4.41,"category":"FINITION"},"4009":{"code":4009,"dim":"1 1\\2","name":"Y Lave vaiselle","cost":6.38,"sell":7.51,"category":"FINITION"},"4010":{"code":4010,"dim":"1 1\\2","name":"P Trap Ajustable","cost":4.5,"sell":5.29,"category":"FINITION"},"4034":{"code":4034,"dim":"Demi","name":"Valve Angle 1/2 x 3/8","cost":12.0,"sell":14.12,"category":"FINITION"},"4035":{"code":4035,"dim":"Demi","name":"Valve Droite 1/1 x 3/8","cost":12.0,"sell":14.12,"category":"FINITION"},"4036":{"code":4036,"dim":"Speed Way","name":"toilette 12","cost":11.0,"sell":12.94,"category":"FINITION"},"4037":{"code":4037,"dim":"Speed Way","name":"Toilette 20","cost":11.5,"sell":13.53,"category":"FINITION"},"4038":{"code":4038,"dim":"Speed Way","name":"Lavabo 12","cost":6.0,"sell":7.06,"category":"FINITION"},"4039":{"code":4039,"dim":"Speed Way","name":"Lavabo 20","cost":8.0,"sell":9.41,"category":"FINITION"},"4040":{"code":4040,"dim":"Speed Way","name":"Frigo 5'","cost":18.0,"sell":21.18,"category":"FINITION"},"4041":{"code":4041,"dim":"Speed Way","name":"Frigo 10'","cost":28.0,"sell":32.94,"category":"FINITION"},"4042":{"code":4042,"dim":"Speed Way","name":"Lave Vaiselle","cost":20.0,"sell":23.53,"category":"FINITION"},"4043":{"code":4043,"dim":"Demi","name":"Valve Antibélier 1/2 x 3/8","cost":17.0,"sell":20.0,"category":"FINITION"},"4044":{"code":4044,"dim":"Demi","name":"Valve Antibélier 1/2 x 3/8 UPONOR","cost":31.0,"sell":36.47,"category":"FINITION"},"4045":{"code":4045,"dim":"Demi","name":"Flange Chromée","cost":4.0,"sell":4.71,"category":"FINITION"},"4046":{"code":4046,"dim":"n/a","name":"Tube Silicone Clair","cost":10.0,"sell":11.76,"category":"FINITION"},"4047":{"code":4047,"dim":"n/a","name":"Silicone DAP","cost":7.5,"sell":8.82,"category":"FINITION"},"4048":{"code":4048,"dim":"n/a","name":"Roulette Teflon","cost":1.0,"sell":1.18,"category":"FINITION"},"4049":{"code":4049,"dim":"4\"","name":"Flange Brass Pour Plomb Toil.","cost":16.5,"sell":19.41,"category":"FINITION"},"4050":{"code":4050,"dim":"4\"","name":"Flange Sioux Chief Twist N' Set","cost":38.0,"sell":44.71,"category":"FINITION"},"4051":{"code":4051,"dim":"n/a","name":"Bolt Toilette Brass","cost":7.89,"sell":9.28,"category":"FINITION"},"4052":{"code":4052,"dim":"n/a","name":"Bolt Toilette Plastique","cost":3.0,"sell":3.53,"category":"FINITION"},"4053":{"code":4053,"dim":"n/a","name":"Beigne Cire Toilette Regulier","cost":3.5,"sell":4.12,"category":"FINITION"},"4054":{"code":4054,"dim":"n/a","name":"Beigne Cire Toilette Jumbo","cost":4.5,"sell":5.29,"category":"FINITION"},"4055":{"code":4055,"dim":"Demi","name":"Valve Frigo 1/2x1/4","cost":30.0,"sell":35.29,"category":"FINITION"},"4056":{"code":4056,"dim":"24","name":"Panne Chauffe-Eau 24\"'","cost":25.0,"sell":29.41,"category":"FINITION"},"4057":{"code":4057,"dim":"26","name":"Panne Chauffe-Eau 26\"","cost":30.0,"sell":35.29,"category":"FINITION"},"4058":{"code":4058,"dim":"3\"","name":"Grille Chromée Drain Plancher","cost":10.0,"sell":11.76,"category":"FINITION"},"4059":{"code":4059,"dim":"1\"","name":"Mammelon Filleté","cost":3.0,"sell":3.53,"category":"FINITION"},"4060":{"code":4060,"dim":"1 1\\2","name":"Mammelon Filleté","cost":3.5,"sell":4.12,"category":"FINITION"},"4061":{"code":4061,"dim":"2\"","name":"Mammelon Filleté","cost":3.75,"sell":4.41,"category":"FINITION"},"4062":{"code":4062,"dim":"2.5","name":"Mammelon Filleté","cost":4.0,"sell":4.71,"category":"FINITION"},"4063":{"code":4063,"dim":"3","name":"Mammelon Filleté","cost":4.25,"sell":5.0,"category":"FINITION"},"4064":{"code":4064,"dim":"1.25","name":"Drain Lavabo Pop-Up","cost":30.0,"sell":35.29,"category":"FINITION"},"4065":{"code":4065,"dim":"1.5","name":"Crepine Evier Kindred","cost":30.0,"sell":35.29,"category":"FINITION"},"4066":{"code":4066,"dim":"1.5","name":"Tail-Piece 1 1/2 x 6 Brass","cost":7.0,"sell":8.24,"category":"FINITION"},"4067":{"code":4067,"dim":"Demi","name":"Robinet de purge","cost":13.0,"sell":15.29,"category":"FINITION"},"4068":{"code":4068,"dim":"Demi","name":"Sortie Bec de Bain","cost":7.5,"sell":8.82,"category":"FINITION"},"4069":{"code":4069,"dim":"Demi","name":"Valve Angle 1/2 x 3/8 PROPRESS","cost":22.5,"sell":26.47,"category":"FINITION"},"4070":{"code":4070,"dim":"Demi","name":"Valve Droite 1/2 x 3/8 PROPRESS","cost":22.5,"sell":26.47,"category":"FINITION"},"4071":{"code":4071,"dim":"n/a","name":"Valve remplissage toilette Korky","cost":30.0,"sell":35.29,"category":"FINITION"},"4072":{"code":4072,"dim":"1 1\\2","name":"P-Trap Ajustable PVC","cost":20.0,"sell":23.53,"category":"FINITION"},"4073":{"code":4073,"dim":"1 1\\2","name":"Coupling PVC","cost":4.25,"sell":5.0,"category":"FINITION"},"4074":{"code":4074,"dim":"1 1\\2","name":"Adapteur Siphon 1 1/2 x 1 1/4 PVC","cost":10.5,"sell":12.35,"category":"FINITION"},"4075":{"code":4075,"dim":"1.5","name":"P-Trap Collée  XFR","cost":42.5,"sell":50.0,"category":"FINITION"},"4076":{"code":4076,"dim":"1 1\\2","name":"Coupling XFR","cost":7.0,"sell":8.24,"category":"FINITION"},"4077":{"code":4077,"dim":"1 1\\2","name":"Coude 45 XFR","cost":8.0,"sell":9.41,"category":"FINITION"},"4078":{"code":4078,"dim":"1.5","name":"Longueur Tuyau XFR","cost":200.0,"sell":235.29,"category":"FINITION"},"4079":{"code":4079,"dim":"4","name":"Regard de nettoyage commercial","cost":35.0,"sell":41.18,"category":"FINITION"},"4080":{"code":4080,"dim":"4","name":"Clapet Antiretour","cost":40.0,"sell":47.06,"category":"FINITION"},"4081":{"code":4081,"dim":"n/a","name":"Support UNISTRUT 10'","cost":40.0,"sell":47.06,"category":"FINITION"},"4082":{"code":4082,"dim":"Trois-Quart","name":"Ball Valve AQUARISE","cost":150.0,"sell":176.47,"category":"FINITION"},"4083":{"code":4083,"dim":"POUCE","name":"Ball Valve AQUARISE","cost":163.0,"sell":191.76,"category":"FINITION"},"4084":{"code":4084,"dim":"1.5","name":"Ball Valve AQUARISE","cost":200.0,"sell":235.29,"category":"FINITION"},"4085":{"code":4085,"dim":"Trois-Quart","name":"Coude 90 AQUARISE","cost":10.0,"sell":11.76,"category":"FINITION"},"4086":{"code":4086,"dim":"POUCE","name":"T AQUARISE","cost":1.0,"sell":1.18,"category":"FINITION"},"4087":{"code":4087,"dim":"POUCE","name":"Bushing Reduit 1\"x3/4\"","cost":12.0,"sell":14.12,"category":"FINITION"},"4088":{"code":4088,"dim":"Demi","name":"Coude Oreille Cuivre","cost":7.75,"sell":9.12,"category":"FINITION"},"4089":{"code":4089,"dim":"60 Gal","name":"Chauffe-Eau Rheem Professionnal","cost":800.0,"sell":941.18,"category":"FINITION"},"4090":{"code":4090,"dim":"40 Gal","name":"Chauffe-Eau Rheem Professionnal","cost":650.0,"sell":764.71,"category":"FINITION"},"4091":{"code":4091,"dim":"Demi","name":"Hose Flexible Renforcee 1 pi","cost":1.5,"sell":1.76,"category":"FINITION"},"4092":{"code":4092,"dim":"n/a","name":"Extension Flange","cost":22.0,"sell":25.88,"category":"FINITION"},"4093":{"code":4093,"dim":"na","name":"rallonge barre thermo","cost":40.0,"sell":47.06,"category":"FINITION"},"4094":{"code":4094,"dim":"Demi","name":"Union Brass","cost":8.67,"sell":10.2,"category":"FINITION"},"4095":{"code":4095,"dim":"Demi","name":"Valve expension Finition","cost":20.0,"sell":23.53,"category":"FINITION"}};

const TPS = 0.05;
const TVQ = 0.09975;
const CAT_COLORS = {
  "ROUGH ABS": "#e85d26",
  "ROUGH PEX": "#2563eb",
  "FOND DE TERRE": "#16a34a",
  "FINITION": "#9333ea",
};

const DEFAULT_MARGINS = { 'ROUGH ABS': 0.30, 'ROUGH PEX': 0.30, 'FOND DE TERRE': 0.20, 'FINITION': 0.15 };
const fmt = (n) => `$${n.toFixed(2)}`;
const pct = (n) => `${Math.round(n * 100)}%`;

async function parseNotesWithAI(text) {
  const productList = Object.values(PRODUCTS).map(p => `${p.code}: ${p.name} (${p.dim}) [${p.category}]`).join('\n');
  const prompt = `You are a plumbing materials invoice assistant. Parse the following Apple Notes text from a plumber's job site takeoff and extract all materials with quantities.

PRODUCT CATALOG (code: name (dimension) [category]):
${productList}

NOTES TEXT:
${text}

Return ONLY a JSON array with no explanation, no markdown fences. Each item must have:
- "note": the original text fragment from the notes (exact words used)
- "qty": quantity as a decimal number (float) - preserve fractions exactly. "2.5 longueurs" → 2.5
- "confidence": number from 0 to 1 indicating how confident you are in the match
- "matches": array of up to 3 best matching products from catalog, each with:
  - "code": product code (integer)
  - "name": product name from catalog
  - "dim": dimension
  - "category": category
  - "reason": brief reason why this matches (1 sentence max)

Rules:
- confidence >= 0.85 means you are very sure (exact or near-exact name match)
- confidence < 0.85 means there is ambiguity - provide 2-3 alternatives in matches array
- If a product code is written directly (like "1003"), confidence = 1.0
- Preserve decimal quantities exactly
- NEVER match "valve" to a T or TY pipe fitting
- NEVER match "coude" to a valve
- "valve antibelier uponor" → code 4044, confidence 1.0
- "valve antibelier" → code 4043, confidence 1.0
- "valve angle" → code 4034 or 4069 only
- "valve droite" → code 4035 or 4070 only
- The first item in "matches" is always your best guess`;

  const response = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  if (!data.content || !Array.isArray(data.content)) throw new Error("Réponse invalide: " + JSON.stringify(data));
  const raw = data.content.map(i => i.text || "").join("");
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

const SAMPLE_NOTES = `Maison Martin - Salle de bain principale
Date: 8 mars 2026

Rough ABS:
- 6x coude 90 1.5"
- 4x coude 45 1.5"  
- 2x TY 1.5"
- 1x P-trap collée 1.5"
- 3x coupling 2"
- 1x tuyau 12' 2"

Finition:
- 2x valve antibélier UPONOR
- 1x beigne cire toilette jumbo
- 2x bolt toilette plastique
- 1x flange chromée
- 1x p-trap ajustable

Alimentation eau:
- 4x coude 90 UPONOR 1/2
- 2x T UPONOR 1/2
- 3x bague UPONOR demi`;

const THEMES = {
  dark: {
    name: "🌑 Sombre",
    bg: "#0f0f0f", header: "#1a1a1a", card: "#1a1a1a", border: "#2a2a2a",
    accent: "#e85d26", text: "#e8e8e8", textMuted: "#888", textLight: "#555",
    inputBg: "#0f0f0f", rowAlt: "#141414", rowBorder: "#1f1f1f",
  },
  light: {
    name: "☀️ Clair",
    bg: "#f5f5f5", header: "#ffffff", card: "#ffffff", border: "#e0e0e0",
    accent: "#e85d26", text: "#1a1a1a", textMuted: "#555", textLight: "#999",
    inputBg: "#fafafa", rowAlt: "#fafafa", rowBorder: "#eeeeee",
  },
  blue: {
    name: "🔵 Bleu",
    bg: "#ddeeff", header: "#1a3a5c", card: "#ffffff", border: "#b0cfe8",
    accent: "#1a6bb5", text: "#1a2a3a", textMuted: "#4a6a8a", textLight: "#7a9ab5",
    inputBg: "#f0f7ff", rowAlt: "#f5faff", rowBorder: "#e0eef8",
  },
  green: {
    name: "🟢 Vert",
    bg: "#e8f5e9", header: "#1b5e20", card: "#ffffff", border: "#a5d6a7",
    accent: "#2e7d32", text: "#1b2e1c", textMuted: "#4a7a4e", textLight: "#7aaa7e",
    inputBg: "#f1f8f1", rowAlt: "#f5fbf5", rowBorder: "#dceedd",
  },
  navy: {
    name: "🌊 Marine",
    bg: "#1a2340", header: "#0f1628", card: "#1e2a4a", border: "#2d3d6a",
    accent: "#4a90d9", text: "#e8eeff", textMuted: "#8899cc", textLight: "#556699",
    inputBg: "#151e38", rowAlt: "#1c2642", rowBorder: "#253357",
  },
  girlypop: {
    name: "🌸 Girlypop",
    bg: "#fff0f6", header: "#d63384", card: "#ffffff", border: "#f9a8d4",
    accent: "#e91e8c", text: "#4a0028", textMuted: "#a0426e", textLight: "#c77fa0",
    inputBg: "#fff5f9", rowAlt: "#fff0f6", rowBorder: "#fce4ec",
  },
};

export default function App() {
  const [tab, setTab] = useState("parse");
  const [notesText, setNotesText] = useState(() => localStorage.getItem('notesText') ?? SAMPLE_NOTES);
  useEffect(() => { localStorage.setItem('notesText', notesText); }, [notesText]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [clientName, setClientName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [invoiceNum, setInvoiceNum] = useState("001");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");
  const [themeName, setThemeName] = useState(() => localStorage.getItem('themeName') || "blue");
  useEffect(() => { localStorage.setItem('themeName', themeName); }, [themeName]);
  const [showThemes, setShowThemes] = useState(false);
  const [customProducts, setCustomProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('customProducts') || '{}'); } catch(e) { return {}; }
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ code: '', name: '', dim: '', category: 'ROUGH ABS', cost: '' });
  const [addError, setAddError] = useState('');
  const [editingCode, setEditingCode] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [pendingReview, setPendingReview] = useState([]); // items needing user selection
  const [categoryMargins, setCategoryMargins] = useState(() => {
    try { return JSON.parse(localStorage.getItem('categoryMargins') || 'null') || { ...DEFAULT_MARGINS }; } catch(e) { return { ...DEFAULT_MARGINS }; }
  });
  const [showMarginSettings, setShowMarginSettings] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [listHistory, setListHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('listHistory') || '[]'); } catch(e) { return []; }
  });
  const [historySync, setHistorySync] = useState(null); // null | 'sync' | 'ok' | 'offline'
  const [catalogSync, setCatalogSync] = useState(null);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editHistoryForm, setEditHistoryForm] = useState({ clientName: '', jobDesc: '', invoiceNum: '' });
  const [jobAddress, setJobAddress] = useState('');
  const [margeBonus, setMargeBonus] = useState(0); // 0 | 0.05 | 0.10 | 0.15 | 0.20

  const subtotalBase = invoiceItems.reduce((s, i) => s + i.qty * i.product.sell, 0);
  const bonusAmount = subtotalBase * margeBonus;
  const subtotal = subtotalBase + bonusAmount;
  const tps = subtotal * TPS;
  const tvq = subtotal * TVQ;
  const total = subtotal + tps + tvq;

  const getSellPrice = (cost, category, overrideMargin) => {
    const margin = overrideMargin != null ? overrideMargin : (categoryMargins[category] ?? DEFAULT_MARGINS[category] ?? 0.30);
    return parseFloat((cost / (1 - margin)).toFixed(2));
  };

  const saveCategoryMargins = (updated) => {
    setCategoryMargins(updated);
    localStorage.setItem('categoryMargins', JSON.stringify(updated));
  };

  const saveToHistory = (items, client, job, num) => {
    if (!items || items.length === 0) return;
    const sub = items.reduce((s, i) => s + i.qty * i.product.sell, 0);
    const entry = {
      id: Date.now().toString(36),
      savedAt: new Date().toISOString(),
      clientName: client || '',
      jobDesc: job || '',
      invoiceNum: num || '',
      items,
      subtotal: sub,
      total: sub * (1 + TPS + TVQ),
    };
    const updated = [entry, ...listHistory].slice(0, 50);
    setListHistory(updated);
    localStorage.setItem('listHistory', JSON.stringify(updated));
    // Sync vers le serveur (tous les appareils)
    fetch('/api/history-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', entry }),
    }).catch(() => {}); // hors-ligne : sauvegardé localement quand même
  };

  const deleteFromHistory = (id) => {
    const updated = listHistory.filter(e => e.id !== id);
    setListHistory(updated);
    localStorage.setItem('listHistory', JSON.stringify(updated));
    // Sync suppression vers le serveur
    fetch('/api/history-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id }),
    }).catch(() => {});
  };

  const updateHistoryEntry = (id, fields) => {
    const updated = listHistory.map(e => e.id === id ? { ...e, ...fields } : e);
    setListHistory(updated);
    localStorage.setItem('listHistory', JSON.stringify(updated));
    fetch('/api/history-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, fields }),
    }).catch(() => {});
    setEditingHistoryId(null);
  };

  const loadFromHistory = (entry) => {
    setInvoiceItems(entry.items);
    if (entry.clientName) setClientName(entry.clientName);
    if (entry.jobDesc) setJobDesc(entry.jobDesc);
    if (entry.invoiceNum) setInvoiceNum(entry.invoiceNum);
    setTab('invoice');
  };

  const handleParse = async () => {
    if (!notesText.trim()) return;
    setParsing(true);
    setParseError(null);
    setPendingReview([]);
    try {
      const parsed = await parseNotesWithAI(notesText);
      const allProducts = { ...PRODUCTS, ...customProducts };
      const confident = [];
      const uncertain = [];

      parsed.forEach(i => {
        if (!i.matches || i.matches.length === 0) return;
        const qty = i.qty || 1;
        const confidence = i.confidence || 0;
        const best = i.matches[0];

        if (confidence >= 0.85 && allProducts[String(best.code)]) {
          confident.push({
            id: Math.random().toString(36).slice(2),
            product: allProducts[String(best.code)],
            qty,
            note: i.note,
          });
        } else {
          // needs user review
          uncertain.push({
            id: Math.random().toString(36).slice(2),
            note: i.note,
            qty,
            confidence,
            matches: i.matches.filter(m => allProducts[String(m.code)]).map(m => ({
              ...m,
              product: allProducts[String(m.code)]
            })),
          });
        }
      });

      setInvoiceItems(confident);
      if (uncertain.length > 0) {
        setPendingReview(uncertain);
      } else if (confident.length > 0) {
        saveToHistory(confident, clientName, jobDesc, invoiceNum);
        setTab("invoice");
      }
    } catch (e) {
      setParseError("Erreur de parsing: " + e.message);
    }
    setParsing(false);
  };

  const confirmReviewItem = (reviewId, selectedCode) => {
    const allProducts = { ...PRODUCTS, ...customProducts };
    const item = pendingReview.find(r => r.id === reviewId);
    if (!item || !allProducts[String(selectedCode)]) return;
    setInvoiceItems(prev => [...prev, {
      id: Math.random().toString(36).slice(2),
      product: allProducts[String(selectedCode)],
      qty: item.qty,
      note: item.note,
    }]);
    const remaining = pendingReview.filter(r => r.id !== reviewId);
    setPendingReview(remaining);
    if (remaining.length === 0) {
      const finalItems = [...invoiceItems, {
        id: Math.random().toString(36).slice(2),
        product: allProducts[String(selectedCode)],
        qty: item.qty,
        note: item.note,
      }];
      saveToHistory(finalItems, clientName, jobDesc, invoiceNum);
      setTab("invoice");
    }
  };

  const skipReviewItem = (reviewId) => {
    const remaining = pendingReview.filter(r => r.id !== reviewId);
    setPendingReview(remaining);
    if (remaining.length === 0 && invoiceItems.length > 0) setTab("invoice");
  };

  const updateQty = (id, val) => {
    // Store raw string while typing so "2." doesn't get wiped mid-entry
    setInvoiceItems(prev => prev.map(i => i.id === id ? { ...i, qty: val } : i));
  };

  const commitQty = (id, val) => {
    // On blur, convert to final float
    const num = Math.max(0, parseFloat(val) || 0);
    setInvoiceItems(prev => prev.map(i => i.id === id ? { ...i, qty: num } : i));
  };

  const removeItem = (id) => setInvoiceItems(prev => prev.filter(i => i.id !== id));

  const addProduct = (code) => {
    const p = PRODUCTS[String(code)] || customProducts[String(code)];
    if (!p) return;
    const existing = invoiceItems.find(i => i.product.code === p.code);
    if (existing) {
      setInvoiceItems(prev => prev.map(i => i.id === existing.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setInvoiceItems(prev => [...prev, { id: Math.random().toString(36).slice(2), product: p, qty: 1, note: "" }]);
    }
  };

  const allProducts = Object.values({ ...PRODUCTS, ...customProducts });

  const saveCustomProduct = () => {
    setAddError('');
    const code = newProduct.code.trim();
    const cost = parseFloat(newProduct.cost);
    if (!code) return setAddError('Code requis');
    if (!newProduct.name.trim()) return setAddError('Nom requis');
    if (!cost || cost <= 0) return setAddError('Coût invalide');
    if (PRODUCTS[code] || customProducts[code]) return setAddError('Ce code existe déjà');
    const margin = categoryMargins[newProduct.category] ?? DEFAULT_MARGINS[newProduct.category] ?? 0.30;
    const sell = getSellPrice(cost, newProduct.category);
    const product = { code, name: newProduct.name.trim(), dim: newProduct.dim.trim(), category: newProduct.category, cost, sell };
    const updated = { ...customProducts, [code]: product };
    setCustomProducts(updated);
    localStorage.setItem('customProducts', JSON.stringify(updated));
    setNewProduct({ code: '', name: '', dim: '', category: 'ROUGH ABS', cost: '' });
    setShowAddForm(false);
    // Sync vers le serveur (tous les appareils)
    fetch('/api/catalog-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', product }),
    }).catch(() => {});
  };

  const startEdit = (p) => {
    setEditingCode(String(p.code));
    setEditForm({ name: p.name, dim: p.dim, category: p.category, cost: p.cost, overrideMargin: p.overrideMargin != null ? String(Math.round(p.overrideMargin * 100)) : '' });
  };

  const saveEdit = (code) => {
    const cost = parseFloat(editForm.cost);
    if (!editForm.name.trim() || !cost || cost <= 0) return;
    // overrideMargin is stored as a percentage string (e.g. "25" = 25%) — divide by 100 to get decimal
    const overrideMargin = editForm.overrideMargin !== '' && editForm.overrideMargin != null
      ? parseFloat(editForm.overrideMargin) / 100
      : null;
    const sell = getSellPrice(cost, editForm.category, overrideMargin);
    const product = { ...customProducts[code], code: parseInt(code), name: editForm.name.trim(), dim: editForm.dim.trim(), category: editForm.category, cost, sell, overrideMargin };
    const updated = { ...customProducts, [code]: product };
    setCustomProducts(updated);
    localStorage.setItem('customProducts', JSON.stringify(updated));
    setEditingCode(null);
    // Sync vers le serveur (tous les appareils)
    fetch('/api/catalog-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save', product }),
    }).catch(() => {});
  };

  const deleteCustomProduct = (code) => {
    const updated = { ...customProducts };
    delete updated[code];
    setCustomProducts(updated);
    localStorage.setItem('customProducts', JSON.stringify(updated));
    // Sync suppression vers le serveur
    fetch('/api/catalog-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', code }),
    }).catch(() => {});
  };
  const cats = ["ALL", ...new Set(allProducts.map(p => p.category))];
  const filtered = allProducts.filter(p => {
    const matchCat = selectedCat === "ALL" || p.category === selectedCat;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.code).includes(searchTerm);
    return matchCat && matchSearch;
  });

  const saveToWeeklyReport = async () => {
    if (invoiceItems.length === 0) return;
    const weekKey = (() => {
      const now = new Date();
      const jan1 = new Date(now.getFullYear(), 0, 1);
      const week = Math.ceil(((now - jan1) / 86400000 + jan1.getDay() + 1) / 7);
      return `report_${now.getFullYear()}_${String(week).padStart(2, '0')}`;
    })();

    // Build items map
    const items = {};
    invoiceItems.forEach(item => {
      const code = String(item.product.code);
      if (items[code]) {
        items[code].qty += parseFloat(item.qty) || 0;
      } else {
        items[code] = {
          code: item.product.code,
          name: item.product.name,
          dim: item.product.dim,
          category: item.product.category,
          qty: parseFloat(item.qty) || 0,
        };
      }
    });

    // Always save locally as backup (works offline)
    try {
      const local = JSON.parse(localStorage.getItem(weekKey) || '{}');
      Object.entries(items).forEach(([code, item]) => {
        if (local[code]) { local[code].qty += item.qty; } else { local[code] = item; }
      });
      localStorage.setItem(weekKey, JSON.stringify(local));
    } catch(_) {}

    // Sync to server (cross-device: phone + computer + associate)
    try {
      const res = await fetch(`/api/report-data?key=${weekKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSaveStatus('✅ Ajouté au rapport de la semaine!');
    } catch(e) {
      // Server sync failed but local backup succeeded
      setSaveStatus('✅ Sauvegardé localement (synchro hors ligne)');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const printInvoice = () => {
    // Le sous-total PDF inclut silencieusement la marge bonus (non affichée au client)
    const subBase = invoiceItems.reduce((s, i) => s + i.qty * i.product.sell, 0);
    const sub = subBase * (1 + margeBonus);
    const tpsAmt = sub * TPS;
    const tvqAmt = sub * TVQ;
    const tot = sub + tpsAmt + tvqAmt;

    const rows = invoiceItems.map(item => `
      <tr>
        <td>${item.product.name}</td>
        <td>${item.product.dim}</td>
        <td style="text-align:center">${item.qty}</td>
        <td style="text-align:right">${fmt(item.product.sell * (1 + margeBonus))}</td>
        <td style="text-align:right">${fmt(item.qty * item.product.sell * (1 + margeBonus))}</td>
      </tr>`).join('');

    const logoUrl = window.location.origin + (process.env.PUBLIC_URL || '') + '/logo.svg';
    const html = `<!DOCTYPE html><html><head>
      <meta charset="utf-8"/>
      <title>Facture ${invoiceNum}</title>
      <style>
        body{font-family:Arial,sans-serif;padding:24px;color:#1a1a1a;font-size:14px}
        h1{font-size:1.4em;margin:0 0 4px}p{margin:2px 0;color:#555}
        .header{margin-bottom:20px;border-bottom:2px solid #0c2240;padding-bottom:14px;display:flex;align-items:center;gap:20px}
        .header-info{flex:1}
        .header img{height:72px;width:auto;display:block}
        table{width:100%;border-collapse:collapse;margin-top:16px}
        th{background:#f3f4f6;padding:8px;text-align:left;font-size:12px;text-transform:uppercase;letter-spacing:.5px}
        td{padding:8px;border-bottom:1px solid #e5e7eb}
        tr:last-child td{border:none}
        .totals{margin-top:12px;text-align:right}
        .totals div{padding:3px 0;font-size:13px;color:#555}
        .grand-total{background:#0c2240;color:white;padding:10px 14px;border-radius:6px;font-size:1.1em;font-weight:700;margin-top:8px;display:inline-block}
      </style>
    </head><body>
      <div class="header">
        <img src="${logoUrl}" alt="Révolution Plomberie"/>
        <div class="header-info">
          <p><strong>Facture #${invoiceNum}</strong></p>
          ${clientName ? `<p>Client: ${clientName}</p>` : ''}
          ${jobAddress ? `<p>Adresse: ${jobAddress}</p>` : ''}
          ${jobDesc ? `<p>Travaux: ${jobDesc}</p>` : ''}
          <p style="color:#999;font-size:12px">${new Date().toLocaleDateString('fr-CA')}</p>
        </div>
      </div>
      <table>
        <thead><tr>
          <th>Article</th><th>Dim.</th>
          <th style="text-align:center">Qté</th>
          <th style="text-align:right">Prix unit.</th>
          <th style="text-align:right">Total</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="totals">
        <div>Sous-total: <strong>${fmt(sub)}</strong></div>
        <div>TPS (5%): <strong>${fmt(tpsAmt)}</strong></div>
        <div>TVQ (9.975%): <strong>${fmt(tvqAmt)}</strong></div>
        <div class="grand-total">TOTAL: ${fmt(tot)}</div>
      </div>
    </body></html>`;

    // Iframe invisible — seule méthode fiable sur iOS Safari
    const iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:none;visibility:hidden;';
    document.body.appendChild(iframe);
    iframe.contentDocument.open();
    iframe.contentDocument.write(html);
    iframe.contentDocument.close();
    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      setTimeout(() => document.body.removeChild(iframe), 2000);
    }, 300);
  };

  const C = THEMES[themeName] || THEMES.blue;

  const PASSWORD = "Nelson23$$";
  const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 heures en ms
  const [authed, setAuthed] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem('plomb_auth') || 'null');
      return data && (Date.now() - data.ts) < AUTH_DURATION;
    } catch(e) { return false; }
  });
  const [pwInput, setPwInput] = useState('');
  const [pwError, setPwError] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileView, setMobileView] = useState('mobile'); // 'mobile' | 'desktop'
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Refs pour les timers de retry (évite les fuites mémoire)
  const catalogRetryRef = useRef(null);
  const historyRetryRef = useRef(null);

  // Sync catalogue — serveur = source de vérité (multi-utilisateurs)
  const syncCatalog = useCallback(() => {
    if (catalogRetryRef.current) { clearTimeout(catalogRetryRef.current); catalogRetryRef.current = null; }
    setCatalogSync('sync');
    fetch('/api/catalog-data')
      .then(r => r.ok ? r.json() : null)
      .then(serverCatalog => {
        if (!serverCatalog || typeof serverCatalog !== 'object') {
          setCatalogSync('offline');
          catalogRetryRef.current = setTimeout(() => syncCatalog(), 30000);
          return;
        }
        setCustomProducts(prev => {
          const merged = { ...prev, ...serverCatalog };
          localStorage.setItem('customProducts', JSON.stringify(merged));
          const localOnly = Object.values(prev).filter(p => !serverCatalog[String(p.code)]);
          localOnly.forEach(product => {
            fetch('/api/catalog-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'save', product }) }).catch(() => {});
          });
          return merged;
        });
        setCatalogSync('ok');
        setTimeout(() => setCatalogSync(null), 2500);
      })
      .catch(() => {
        setCatalogSync('offline');
        catalogRetryRef.current = setTimeout(() => syncCatalog(), 30000);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { syncCatalog(); }, [syncCatalog]);
  useEffect(() => {
    const interval = setInterval(() => syncCatalog(), 60000);
    return () => { clearInterval(interval); if (catalogRetryRef.current) clearTimeout(catalogRetryRef.current); };
  }, [syncCatalog]);

  // Sync historique — fusion serveur + local
  const syncHistory = useCallback(() => {
    if (historyRetryRef.current) { clearTimeout(historyRetryRef.current); historyRetryRef.current = null; }
    setHistorySync('sync');
    fetch('/api/history-data')
      .then(r => r.ok ? r.json() : null)
      .then(serverHistory => {
        if (!Array.isArray(serverHistory)) {
          setHistorySync('offline');
          historyRetryRef.current = setTimeout(() => syncHistory(), 30000);
          return;
        }
        setListHistory(prev => {
          const map = new Map();
          [...prev, ...serverHistory].forEach(e => { if (e && e.id) map.set(e.id, e); });
          const merged = [...map.values()].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)).slice(0, 50);
          localStorage.setItem('listHistory', JSON.stringify(merged));
          return merged;
        });
        setHistorySync('ok');
        setTimeout(() => setHistorySync(null), 2500);
      })
      .catch(() => {
        setHistorySync('offline');
        historyRetryRef.current = setTimeout(() => syncHistory(), 30000);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { syncHistory(); }, [syncHistory]);
  useEffect(() => {
    const interval = setInterval(() => syncHistory(), 60000);
    return () => { clearInterval(interval); if (historyRetryRef.current) clearTimeout(historyRetryRef.current); };
  }, [syncHistory]);

  const handleLogin = () => {
    if (pwInput === PASSWORD) {
      localStorage.setItem('plomb_auth', JSON.stringify({ ts: Date.now() }));
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPwInput('');
    }
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: '#0f1628', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui,-apple-system,sans-serif', position: 'relative' }}>
      <img src={process.env.PUBLIC_URL + '/bg-pipes.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', opacity: 0.22, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }} />
      <img src={process.env.PUBLIC_URL + '/logo.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '55vw', maxWidth: 520, opacity: 0.07, pointerEvents: 'none', zIndex: 0, userSelect: 'none', filter: 'brightness(0) invert(1)' }} />
      <div style={{ position: 'relative', zIndex: 1, background: '#1e2a4a', border: '1px solid #2d3d6a', borderRadius: 16, padding: '40px 32px', width: '100%', maxWidth: 360, textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ width: 60, height: 60, background: '#1a6bb5', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 20px' }}>🔧</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 4 }}>Révolution<span style={{ color: '#4a90d9' }}> Facturation</span></div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: 2, marginBottom: 32 }}>ACCÈS SÉCURISÉ</div>
        <input
          type="password"
          value={pwInput}
          onChange={e => { setPwInput(e.target.value); setPwError(false); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          placeholder="Mot de passe"
          autoFocus
          style={{ width: '100%', padding: '14px 16px', background: '#151e38', border: `2px solid ${pwError ? '#e74c3c' : '#2d3d6a'}`, borderRadius: 10, color: 'white', fontSize: 16, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 8 }}
        />
        {pwError && <div style={{ color: '#e74c3c', fontSize: 13, marginBottom: 8 }}>Mot de passe incorrect</div>}
        <button onClick={handleLogin} style={{ width: '100%', padding: 14, background: '#1a6bb5', border: 'none', borderRadius: 10, color: 'white', fontSize: 16, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer', marginTop: 8 }}>
          Connexion →
        </button>
      </div>
    </div>
  );

  // ── MOBILE LAYOUT ─────────────────────────────────────────────────────────
  if (isMobile && mobileView === 'mobile') {
    const mTabs = [
      { id: 'parse', icon: '📋', label: 'Notes' },
      { id: 'invoice', icon: '📦', label: `Liste (${invoiceItems.length})` },
      { id: 'catalog', icon: '🗂️', label: 'Catalogue' },
      { id: 'history', icon: '🕐', label: 'Historique' },
      { id: 'margins', icon: '📊', label: 'Marges' },
    ];
    return (
      <div style={{ minHeight: '100vh', background: C.bg, fontFamily: 'system-ui,-apple-system,sans-serif', color: C.text, paddingBottom: 'calc(72px + env(safe-area-inset-bottom))' }}>
        <img src={process.env.PUBLIC_URL + '/bg-pipes.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', opacity: 0.14, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }} />
        <img src={process.env.PUBLIC_URL + '/logo.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '90vw', maxWidth: 420, opacity: 0.06, pointerEvents: 'none', zIndex: 0, userSelect: 'none', filter: 'brightness(0) invert(1)' }} />
        <img className="punch-bg" src={process.env.PUBLIC_URL + '/punch.jpg'} alt="" aria-hidden="true" style={{ position: 'fixed', bottom: 90, right: 12, width: 130, height: 130, borderRadius: '50%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none', zIndex: 0 }} />
        {/* Mobile Header */}
        <div style={{ background: C.header, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🔧</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Révolution<span style={{ color: C.accent }}> Facturation</span></span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowThemes(p => !p)} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 16 }}>🎨</button>
            <button onClick={() => setMobileView('desktop')} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>🖥️</button>
            <button onClick={() => { localStorage.removeItem('plomb_auth'); setAuthed(false); }} style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6, color: 'white', cursor: 'pointer', fontSize: 12 }}>🔒</button>
          </div>
          {showThemes && (
            <div style={{ position: 'absolute', right: 12, top: 56, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 8, zIndex: 100, minWidth: 140, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
              {Object.entries(THEMES).map(([key, t]) => (
                <button key={key} onClick={() => { setThemeName(key); setShowThemes(false); }} style={{ display: 'block', width: '100%', padding: '10px 12px', background: themeName === key ? C.accent : 'transparent', border: 'none', borderRadius: 6, color: themeName === key ? 'white' : C.text, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', textAlign: 'left', fontWeight: themeName === key ? 700 : 400 }}>{t.name}</button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Content */}
        <div style={{ padding: '16px 14px' }}>

          {/* PARSE TAB - mobile */}
          {tab === 'parse' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: C.accent, textTransform: 'uppercase' }}>Coller la liste de matériaux</div>
                {notesText.trim() && (
                  <button onClick={() => setNotesText('')} style={{ padding: '5px 12px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>🗑️ Effacer</button>
                )}
              </div>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                placeholder="Collez votre liste ici..."
                style={{ width: '100%', height: 220, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, color: C.text, fontFamily: 'inherit', fontSize: 16, resize: 'none', outline: 'none', boxSizing: 'border-box' }}
              />
              <button onClick={handleParse} disabled={parsing} style={{ marginTop: 12, width: '100%', padding: 18, background: parsing ? C.textLight : C.accent, border: 'none', borderRadius: 12, color: 'white', fontSize: 17, fontFamily: 'inherit', cursor: parsing ? 'not-allowed' : 'pointer', fontWeight: 700, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>
                {parsing ? '⏳ Analyse en cours...' : '⚡ Analyser avec l\'IA'}
              </button>
              {parseError && <div style={{ marginTop: 10, color: '#c0392b', fontSize: 13, background: '#fdecea', padding: '10px 14px', borderRadius: 8 }}>{parseError}</div>}

              {/* Review panel mobile */}
              {pendingReview.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#e67e22', marginBottom: 12 }}>
                    ⚠️ {pendingReview.length} item{pendingReview.length > 1 ? 's' : ''} à confirmer
                  </div>
                  {pendingReview.map(r => (
                    <div key={r.id} style={{ background: C.card, border: '2px solid #e67e22', borderRadius: 12, padding: 14, marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontStyle: 'italic', color: C.text, marginBottom: 4 }}>"{r.note}"</div>
                      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12 }}>Qté: <strong>{r.qty}</strong> · Confiance: <strong style={{ color: '#e67e22' }}>{Math.round(r.confidence * 100)}%</strong></div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {r.matches.slice(0, 3).map((m, idx) => (
                          <button key={m.code} onClick={() => confirmReviewItem(r.id, m.code)} style={{ padding: '12px 14px', background: idx === 0 ? C.accent + '18' : C.inputBg, border: `2px solid ${idx === 0 ? C.accent : C.border}`, borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                            {idx === 0 && <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, marginBottom: 3, letterSpacing: 1 }}>MEILLEUR CHOIX</div>}
                            <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{m.product.name}</div>
                            <div style={{ fontSize: 12, color: C.textMuted }}>#{m.code} · {m.product.dim} · <strong style={{ color: C.accent }}>{fmt(m.product.sell)}</strong></div>
                          </button>
                        ))}
                        <button onClick={() => skipReviewItem(r.id)} style={{ padding: '10px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13 }}>Ignorer</button>
                      </div>
                    </div>
                  ))}
                  {invoiceItems.length > 0 && (
                    <button onClick={() => { setPendingReview([]); setTab('invoice'); }} style={{ width: '100%', padding: 14, background: C.accent, border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700 }}>
                      Voir la liste ({invoiceItems.length} items) →
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* INVOICE TAB - mobile */}
          {tab === 'invoice' && (
            <div>
              {/* Client info compact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {[['Client', clientName, setClientName], ['Adresse des travaux', jobAddress, setJobAddress], ['Description', jobDesc, setJobDesc], ['Facture #', invoiceNum, setInvoiceNum]].map(([label, val, setter]) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
                    <input value={val} onChange={e => setter(e.target.value)} style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: '11px 14px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>

              {/* Items as cards */}
              {invoiceItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: C.textLight, fontSize: 14 }}>
                  Aucun article — analysez vos notes ou ajoutez depuis le catalogue
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {invoiceItems.map((item, idx) => (
                    <div key={item.id} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.product.name}</div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>{item.product.dim} · <span style={{ color: CAT_COLORS[item.product.category], fontWeight: 600 }}>{item.product.category}</span></div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent }}>{fmt(item.qty * item.product.sell)}</div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>{fmt(item.product.sell)} × </div>
                        </div>
                        <input
                          type="number" value={item.qty} onChange={e => updateQty(item.id, e.target.value)} onBlur={e => commitQty(item.id, e.target.value)}
                          step="0.25" min="0" inputMode="decimal"
                          style={{ width: 58, background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 4px', color: C.text, fontFamily: 'inherit', fontSize: 16, textAlign: 'center', outline: 'none' }}
                        />
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 20, padding: '4px', lineHeight: 1 }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Totals */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.rowBorder}`, fontSize: 14, color: C.textMuted }}>
                  <span>Sous-total</span><span>{fmt(subtotalBase)}</span>
                </div>
                {margeBonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.rowBorder}`, fontSize: 14, color: '#16a34a', fontWeight: 600 }}>
                    <span>📈 Marge +{Math.round(margeBonus * 100)}%</span><span>+{fmt(bonusAmount)}</span>
                  </div>
                )}
                {[['TPS (5%)', tps], ['TVQ (9.975%)', tvq]].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.rowBorder}`, fontSize: 14, color: C.textMuted }}>
                    <span>{label}</span><span>{fmt(val)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontSize: 22, fontWeight: 700 }}>
                  <span>TOTAL</span><span style={{ color: C.accent }}>{fmt(total)}</span>
                </div>
              </div>

              {/* Marge bonus buttons - visible app seulement */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 }}>📈 Bonification de marge (interne)</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {[0, 5, 10, 15, 20].map(pct => (
                    <button key={pct} onClick={() => setMargeBonus(pct / 100)}
                      style={{ flex: 1, minWidth: 52, padding: '10px 4px', background: margeBonus === pct / 100 ? (pct === 0 ? C.inputBg : '#16a34a') : C.inputBg,
                        border: `2px solid ${margeBonus === pct / 100 ? (pct === 0 ? C.border : '#16a34a') : C.border}`,
                        borderRadius: 8, color: margeBonus === pct / 100 ? (pct === 0 ? C.textMuted : 'white') : C.textMuted,
                        cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, touchAction: 'manipulation' }}>
                      {pct === 0 ? 'Aucune' : `+${pct}%`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={() => setTab('catalog')} style={{ padding: 15, background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 10, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 600 }}>
                  + Ajouter depuis catalogue
                </button>
                <button onClick={saveToWeeklyReport} disabled={invoiceItems.length === 0} style={{ padding: 15, background: invoiceItems.length === 0 ? C.inputBg : '#16a34a', border: 'none', borderRadius: 10, color: invoiceItems.length === 0 ? C.textLight : 'white', cursor: invoiceItems.length === 0 ? 'not-allowed' : 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700 }}>
                  📊 Ajouter au rapport semaine
                </button>
                <button onClick={printInvoice} style={{ padding: 15, background: C.accent, border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700 }}>
                  🖨️ Imprimer / PDF
                </button>
                {invoiceItems.length > 0 && (
                  <button onClick={() => { if (window.confirm('Effacer la liste actuelle et commencer une nouvelle facture?')) { setInvoiceItems([]); setClientName(''); setJobAddress(''); setJobDesc(''); setInvoiceNum('001'); setMargeBonus(0); setTab('parse'); } }} style={{ padding: 12, background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 10, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>
                    🗑️ Nouvelle facture
                  </button>
                )}
                {saveStatus && <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 600, color: saveStatus.startsWith('✅') ? '#16a34a' : '#c0392b' }}>{saveStatus}</div>}
              </div>
            </div>
          )}

          {/* CATALOG TAB - mobile */}
          {tab === 'catalog' && (
            <div>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Rechercher..." style={{ width: '100%', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '12px 14px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box', marginBottom: 10 }} />
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 12, WebkitOverflowScrolling: 'touch' }}>
                {['ALL', 'ROUGH ABS', 'ROUGH PEX', 'FOND DE TERRE', 'FINITION'].map(cat => (
                  <button key={cat} onClick={() => setSelectedCat(cat)} style={{ padding: '8px 14px', background: selectedCat === cat ? (CAT_COLORS[cat] || C.accent) : C.card, border: `1px solid ${selectedCat === cat ? (CAT_COLORS[cat] || C.accent) : C.border}`, borderRadius: 20, color: selectedCat === cat ? 'white' : C.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit', fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0 }}>{cat}</button>
                ))}
              </div>

              {/* Sync status catalogue - mobile */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {catalogSync === 'sync' && <div style={{ fontSize: 11, color: C.textMuted }}>⟳ Sync catalogue…</div>}
                {catalogSync === 'ok' && <div style={{ fontSize: 11, color: '#16a34a' }}>✓ Catalogue synchronisé</div>}
                {catalogSync === 'offline' && <div style={{ fontSize: 11, color: '#c0392b' }}>📵 Hors-ligne</div>}
                <button onClick={() => syncCatalog()} disabled={catalogSync === 'sync'} style={{ padding: '5px 10px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, touchAction: 'manipulation', opacity: catalogSync === 'sync' ? 0.5 : 1 }}>🔄</button>
              </div>

              {/* Bouton + Nouveau produit - mobile */}
              <button onClick={() => { setShowAddForm(p => !p); setAddError(''); }} style={{ width: '100%', padding: '12px', background: showAddForm ? C.accent : C.card, border: `1px solid ${showAddForm ? C.accent : C.border}`, borderRadius: 10, color: showAddForm ? 'white' : C.accent, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, marginBottom: 12, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>
                {showAddForm ? '✕ Fermer' : '➕ Nouveau produit'}
              </button>

              {/* Formulaire ajout produit - mobile */}
              {showAddForm && (
                <div style={{ background: C.card, border: `2px solid ${C.accent}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 14 }}>Ajouter un nouveau produit</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                    {[['Code', 'code', 'ex: 5001'], ['Nom', 'name', 'ex: Coude 90 spécial'], ['Dimension', 'dim', 'ex: 2']].map(([label, field, placeholder]) => (
                      <div key={field}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                        <input value={newProduct[field]} onChange={e => setNewProduct(p => ({ ...p, [field]: e.target.value }))} placeholder={placeholder} style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Catégorie</div>
                      <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }}>
                        {['ROUGH ABS', 'ROUGH PEX', 'FOND DE TERRE', 'FINITION'].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Coût ($)</div>
                      <input type="number" value={newProduct.cost} onChange={e => setNewProduct(p => ({ ...p, cost: e.target.value }))} placeholder="ex: 12.50" inputMode="decimal" style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  {newProduct.cost && parseFloat(newProduct.cost) > 0 && (
                    <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
                      Prix de vente: <strong style={{ color: C.accent }}>{fmt(getSellPrice(parseFloat(newProduct.cost), newProduct.category))}</strong> (marge {Math.round((categoryMargins[newProduct.category] ?? DEFAULT_MARGINS[newProduct.category]) * 100)}%)
                    </div>
                  )}
                  {addError && <div style={{ color: '#c0392b', fontSize: 13, background: '#fdecea', padding: '8px 12px', borderRadius: 6, marginBottom: 10 }}>{addError}</div>}
                  <button onClick={saveCustomProduct} style={{ width: '100%', padding: 14, background: C.accent, border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 15, fontWeight: 700, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>✓ Sauvegarder</button>
                </div>
              )}

              <div style={{ fontSize: 11, color: C.textLight, marginBottom: 10 }}>{filtered.length} produits</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {filtered.map(p => {
                  const isCustom = !!customProducts[String(p.code)];
                  const isEditing = editingCode === String(p.code);

                  if (isEditing) return (
                    <div key={p.code} style={{ background: C.card, border: `2px solid ${C.accent}`, borderRadius: 12, padding: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 12 }}>✏️ MODIFIER #{p.code}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                        {[['Nom', 'name', 'text'], ['Dimension', 'dim', 'text'], ['Coût ($)', 'cost', 'number']].map(([label, field, type]) => (
                          <div key={field}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>{label}</div>
                            <input type={type} value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                              style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                          </div>
                        ))}
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>Catégorie</div>
                          <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                            style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none' }}>
                            {['ROUGH ABS', 'ROUGH PEX', 'FOND DE TERRE', 'FINITION'].map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, marginBottom: 4, textTransform: 'uppercase' }}>
                            Marge individuelle (%) — laisser vide pour catégorie ({Math.round((categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]) * 100)}%)
                          </div>
                          <input type="number" min="1" max="60"
                            placeholder={`${Math.round((categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]) * 100)} (catégorie)`}
                            value={editForm.overrideMargin ?? ''}
                            onChange={e => setEditForm(f => ({ ...f, overrideMargin: e.target.value === '' ? null : e.target.value }))}
                            style={{ width: '100%', background: C.inputBg, border: `1px solid ${C.accent}`, borderRadius: 8, padding: '10px 12px', color: C.text, fontFamily: 'inherit', fontSize: 16, outline: 'none', boxSizing: 'border-box' }} />
                        </div>
                      </div>
                      {editForm.cost && parseFloat(editForm.cost) > 0 && (() => {
                        const overrideMargin = editForm.overrideMargin ? parseFloat(editForm.overrideMargin) / 100 : null;
                        const effectiveMargin = overrideMargin ?? (categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]);
                        return (
                          <div style={{ fontSize: 12, color: C.textMuted, background: C.inputBg, padding: '8px 12px', borderRadius: 8, marginBottom: 12 }}>
                            Prix vente: <strong style={{ color: C.accent }}>{fmt(getSellPrice(parseFloat(editForm.cost), editForm.category, overrideMargin))}</strong>
                            <span style={{ marginLeft: 8 }}>marge: <strong style={{ color: overrideMargin ? '#e67e22' : C.textMuted }}>{Math.round(effectiveMargin * 100)}%{overrideMargin ? ' (individuelle)' : ' (catégorie)'}</strong></span>
                          </div>
                        );
                      })()}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => saveEdit(String(p.code))} style={{ flex: 1, padding: 12, background: C.accent, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, touchAction: 'manipulation' }}>✓ Sauver</button>
                        <button onClick={() => setEditingCode(null)} style={{ flex: 1, padding: 12, background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, touchAction: 'manipulation' }}>Annuler</button>
                      </div>
                    </div>
                  );

                  return (
                    <div key={p.code} style={{ background: C.card, border: `1px solid ${isCustom ? C.accent : C.border}`, borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 2 }}>
                            {p.name}
                            {isCustom && <span style={{ fontSize: 9, background: C.accent, color: 'white', borderRadius: 3, padding: '1px 5px', marginLeft: 6, fontWeight: 700 }}>CUSTOM</span>}
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted }}>#{p.code} · {p.dim}</div>
                          <div style={{ fontSize: 11, color: C.textLight }}>coût: {fmt(p.cost)}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{fmt(p.sell)}</div>
                          <button onClick={() => { addProduct(p.code); setTab('invoice'); }} style={{ padding: '8px 16px', background: C.accent, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, touchAction: 'manipulation' }}>+ Ajouter</button>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                        <button onClick={() => startEdit(p)} style={{ flex: 1, padding: '8px', background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>✏️ Modifier</button>
                        {isCustom && (
                          <button onClick={() => deleteCustomProduct(String(p.code))} style={{ padding: '8px 16px', background: '#fdecea', border: '1px solid #f5c6c6', borderRadius: 8, color: '#c0392b', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>✕ Supprimer</button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HISTORY TAB - mobile */}
          {tab === 'history' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>
                  🕐 Listes sauvegardées ({listHistory.length})
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {historySync === 'sync' && <div style={{ fontSize: 11, color: C.textMuted }}>⟳ Sync…</div>}
                  {historySync === 'ok' && <div style={{ fontSize: 11, color: '#16a34a' }}>✓ Synchronisé</div>}
                  {historySync === 'offline' && <div style={{ fontSize: 11, color: '#c0392b' }}>📵 Hors-ligne</div>}
                  <button onClick={() => syncHistory()} disabled={historySync === 'sync'} style={{ padding: '5px 10px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 11, touchAction: 'manipulation', opacity: historySync === 'sync' ? 0.5 : 1 }}>🔄</button>
                </div>
              </div>
              {listHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: C.textLight, fontSize: 14 }}>
                  Aucune liste sauvegardée pour l'instant.<br/>Analysez une liste pour commencer.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {listHistory.map(entry => {
                    const d = new Date(entry.savedAt);
                    const dateStr = d.toLocaleDateString('fr-CA', { month: 'short', day: 'numeric' });
                    const timeStr = d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
                    const isEditing = editingHistoryId === entry.id;
                    return (
                      <div key={entry.id} style={{ background: C.card, border: `1px solid ${isEditing ? C.accent : C.border}`, borderRadius: 12, padding: 14 }}>
                        {isEditing ? (
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 10 }}>✏️ Modifier les infos client</div>
                            {[['Client', 'clientName'], ['Description', 'jobDesc'], ['Facture #', 'invoiceNum']].map(([label, key]) => (
                              <div key={key} style={{ marginBottom: 8 }}>
                                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 3 }}>{label}</div>
                                <input
                                  value={editHistoryForm[key]}
                                  onChange={e => setEditHistoryForm(f => ({ ...f, [key]: e.target.value }))}
                                  style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px', color: C.text, fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
                                />
                              </div>
                            ))}
                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                              <button onClick={() => updateHistoryEntry(entry.id, editHistoryForm)} style={{ flex: 1, padding: '9px', background: C.accent, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, touchAction: 'manipulation' }}>
                                ✓ Sauvegarder
                              </button>
                              <button onClick={() => setEditingHistoryId(null)} style={{ padding: '9px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>
                                Annuler
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{entry.clientName || 'Sans client'}</div>
                                {entry.jobDesc && <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{entry.jobDesc}</div>}
                                {entry.invoiceNum && <div style={{ fontSize: 11, color: C.textLight, marginTop: 1 }}>Facture #{entry.invoiceNum}</div>}
                                <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{dateStr} à {timeStr} · {entry.items.length} items</div>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 15, fontWeight: 700, color: C.accent }}>{new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(entry.total)}</div>
                                <div style={{ fontSize: 10, color: C.textLight }}>TPS+TVQ incl.</div>
                              </div>
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 10, lineHeight: 1.6 }}>
                              {entry.items.slice(0, 3).map(i => `${i.qty}× ${i.product.name}`).join(' · ')}
                              {entry.items.length > 3 && ` · +${entry.items.length - 3} autres`}
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button onClick={() => loadFromHistory(entry)} style={{ flex: 1, padding: '10px', background: C.accent, border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 700, touchAction: 'manipulation' }}>
                                ↩ Charger
                              </button>
                              <button onClick={() => { setEditingHistoryId(entry.id); setEditHistoryForm({ clientName: entry.clientName || '', jobDesc: entry.jobDesc || '', invoiceNum: entry.invoiceNum || '' }); }} style={{ padding: '10px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>
                                ✏️
                              </button>
                              <button onClick={() => deleteFromHistory(entry.id)} style={{ padding: '10px 12px', background: '#fdecea', border: '1px solid #f5c6c6', borderRadius: 8, color: '#c0392b', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, touchAction: 'manipulation' }}>
                                ✕
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* MARGINS TAB - mobile */}
          {tab === 'margins' && (() => {
            const cats = ['ROUGH ABS', 'ROUGH PEX', 'FOND DE TERRE', 'FINITION'];
            return (
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 16 }}>Marges par catégorie</div>
                {cats.map(cat => {
                  const current = categoryMargins[cat] ?? DEFAULT_MARGINS[cat];
                  return (
                    <div key={cat} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: CAT_COLORS[cat], display: 'inline-block' }} />
                          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{cat}</span>
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: CAT_COLORS[cat] }}>{Math.round(current * 100)}%</span>
                      </div>
                      <input type="range" min="1" max="60" value={Math.round(current * 100)} onChange={e => saveCategoryMargins({ ...categoryMargins, [cat]: parseFloat(e.target.value) / 100 })} style={{ width: '100%', accentColor: CAT_COLORS[cat], cursor: 'pointer' }} />
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* Bottom Nav */}
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: C.header, borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', zIndex: 50, paddingBottom: 'env(safe-area-inset-bottom)' }}>
          {mTabs.map(({ id, icon, label }) => (
            <button key={id} onClick={() => { setTab(id); if (id === 'history') syncHistory(); if (id === 'catalog') syncCatalog(); }} style={{ flex: 1, padding: '10px 4px 12px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, WebkitTapHighlightColor: 'transparent', touchAction: 'manipulation' }}>
              <span style={{ fontSize: 22 }}>{icon}</span>
              <span style={{ fontSize: 10, color: tab === id ? C.accent : 'rgba(255,255,255,0.5)', fontWeight: tab === id ? 700 : 400 }}>{label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "system-ui, -apple-system, sans-serif", color: C.text }}>
      <img src={process.env.PUBLIC_URL + '/bg-pipes.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', objectFit: 'cover', opacity: 0.14, pointerEvents: 'none', zIndex: 0, userSelect: 'none' }} />
      <img src={process.env.PUBLIC_URL + '/logo.svg'} aria-hidden="true" alt="" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '45vw', maxWidth: 600, opacity: 0.06, pointerEvents: 'none', zIndex: 0, userSelect: 'none', filter: 'brightness(0) invert(1)' }} />
      <img className="punch-bg" src={process.env.PUBLIC_URL + '/punch.jpg'} alt="" aria-hidden="true" style={{ position: 'fixed', bottom: 24, right: 24, width: 160, height: 160, borderRadius: '50%', objectFit: 'cover', opacity: 0.18, pointerEvents: 'none', zIndex: 0 }} />
      {/* Header */}
      <div style={{ background: C.header, padding: "0 24px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: C.accent, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔧</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "white", letterSpacing: 0.5 }}>Révolution<span style={{ color: C.accent }}> Facturation</span></div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: 2 }}>SYSTÈME DE FACTURATION</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {[["parse", "📋 Notes"], ["invoice", `📦 Liste matériel (${invoiceItems.length})`], ["catalog", "🗂️ Catalogue"], ["history", `🕐 Historique (${listHistory.length})`], ["margins", "📊 Marges"]].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); if (id === 'history') syncHistory(); if (id === 'catalog') syncCatalog(); }} style={{
                padding: "8px 18px", background: tab === id ? C.accent : "rgba(255,255,255,0.1)",
                border: `1px solid ${tab === id ? C.accent : "rgba(255,255,255,0.2)"}`,
                borderRadius: 6, color: "white",
                cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: tab === id ? 600 : 400
              }}>{label}</button>
            ))}
            {isMobile && (
              <button onClick={() => setMobileView('mobile')} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>📱</button>
            )}
            <button onClick={() => { localStorage.removeItem('plomb_auth'); setAuthed(false); }} style={{ padding: "8px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, color: "white", cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>🔒</button>
            <div style={{ position: "relative", marginLeft: 8 }}>
              <button onClick={() => setShowThemes(p => !p)} style={{
                padding: "8px 12px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6, color: "white", cursor: "pointer", fontSize: 16, fontFamily: "inherit"
              }}>🎨</button>
              {showThemes && (
                <div style={{
                  position: "absolute", right: 0, top: 44, background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: 8, zIndex: 100, minWidth: 140,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
                }}>
                  {Object.entries(THEMES).map(([key, t]) => (
                    <button key={key} onClick={() => { setThemeName(key); setShowThemes(false); }} style={{
                      display: "block", width: "100%", padding: "8px 12px",
                      background: themeName === key ? C.accent : "transparent",
                      border: "none", borderRadius: 5,
                      color: themeName === key ? "white" : C.text,
                      cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                      textAlign: "left", fontWeight: themeName === key ? 600 : 400
                    }}>{t.name}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>

        {/* PARSE TAB */}
        {tab === "parse" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: C.accent, textTransform: "uppercase" }}>Notes Apple / Takeoff</div>
                  {notesText.trim() && (
                    <button onClick={() => setNotesText('')} style={{ padding: "4px 12px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>🗑️ Effacer</button>
                  )}
                </div>
                <textarea
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  placeholder="Collez votre liste de matériaux ici..."
                  style={{
                    width: "100%", height: 340, background: C.card, border: `1px solid ${C.border}`,
                    borderRadius: 10, padding: 16, color: C.text, fontFamily: "inherit",
                    fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
                  }}
                />
                <button
                  onClick={handleParse}
                  disabled={parsing}
                  style={{
                    marginTop: 12, width: "100%", padding: 14,
                    background: parsing ? C.textLight : C.accent,
                    border: "none", borderRadius: 8, color: "white",
                    fontSize: 14, fontFamily: "inherit",
                    cursor: parsing ? "not-allowed" : "pointer", fontWeight: 700,
                    boxShadow: parsing ? "none" : "0 2px 6px rgba(26,107,181,0.3)"
                  }}
                >
                  {parsing ? "⏳ Analyse en cours..." : "⚡ Analyser avec l'IA"}
                </button>
                {parseError && <div style={{ marginTop: 8, color: "#c0392b", fontSize: 12, background: "#fdecea", padding: "8px 12px", borderRadius: 6 }}>{parseError}</div>}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: C.textMuted, marginBottom: 10, textTransform: "uppercase" }}>Guide d'utilisation</div>
                <div style={{ background: C.card, borderRadius: 10, padding: 20, border: `1px solid ${C.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <div style={{ fontSize: 13, lineHeight: 2, color: C.textMuted }}>
                    <div style={{ color: C.accent, marginBottom: 8, fontWeight: 600 }}>Comment ça fonctionne:</div>
                    <div>1. Copiez votre liste depuis Apple Notes</div>
                    <div>2. Collez le texte dans la zone à gauche</div>
                    <div>3. Cliquez "Analyser avec l'IA"</div>
                    <div>4. Confirmez les items incertains si demandé</div>
                    <div>5. Vérifiez et modifiez la facture générée</div>
                    <div style={{ color: C.accent, marginTop: 12, marginBottom: 8, fontWeight: 600 }}>Formats acceptés:</div>
                    <div style={{ fontFamily: "monospace", background: C.inputBg, padding: 12, borderRadius: 6, fontSize: 12, color: C.text, border: `1px solid ${C.border}` }}>
                      <div>• "6x coude 90 1.5"</div>
                      <div>• "2.5 longueurs 3/4 uponor"</div>
                      <div>• "1003 x 3" (code direct)</div>
                      <div>• "valve antibelier uponor"</div>
                    </div>
                    <div style={{ color: C.textLight, marginTop: 12, fontSize: 11 }}>
                      {Object.keys({...PRODUCTS,...customProducts}).length} produits · TPS 5% · TVQ 9.975%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* REVIEW PANEL - uncertain items */}
            {pendingReview.length > 0 && (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#e67e22", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#e67e22", color: "white", borderRadius: "50%", width: 24, height: 24, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>{pendingReview.length}</span>
                  Item{pendingReview.length > 1 ? "s" : ""} à confirmer — L'IA n'est pas certaine, choisissez le bon produit:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {pendingReview.map(r => (
                    <div key={r.id} style={{ background: C.card, border: `2px solid #e67e22`, borderRadius: 10, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>Texte original:</div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, fontStyle: "italic" }}>"{r.note}"</div>
                          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>Quantité: <strong>{r.qty}</strong> · Confiance IA: <strong style={{ color: r.confidence >= 0.6 ? "#e67e22" : "#c0392b" }}>{Math.round(r.confidence * 100)}%</strong></div>
                        </div>
                        <button onClick={() => skipReviewItem(r.id)} style={{ padding: "4px 10px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, color: C.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
                          Ignorer
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(r.matches.length, 3)}, 1fr)`, gap: 8 }}>
                        {r.matches.slice(0, 3).map((m, idx) => (
                          <button key={m.code} onClick={() => confirmReviewItem(r.id, m.code)} style={{
                            padding: "10px 12px", background: idx === 0 ? C.accent + "15" : C.inputBg,
                            border: `2px solid ${idx === 0 ? C.accent : C.border}`,
                            borderRadius: 8, cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                            transition: "all 0.1s"
                          }}>
                            {idx === 0 && <div style={{ fontSize: 9, fontWeight: 700, color: C.accent, marginBottom: 4, letterSpacing: 1 }}>MEILLEUR CHOIX</div>}
                            <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 3 }}>{m.product.name}</div>
                            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>#{m.code} · {m.product.dim}</div>
                            <div style={{ fontSize: 11, padding: "1px 6px", borderRadius: 3, display: "inline-block", background: (CAT_COLORS[m.product.category] || C.accent) + "22", color: CAT_COLORS[m.product.category] || C.accent, fontWeight: 600 }}>{m.product.category}</div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginTop: 4 }}>{fmt(m.product.sell)}</div>
                            {m.reason && <div style={{ fontSize: 10, color: C.textMuted, marginTop: 4, fontStyle: "italic" }}>{m.reason}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {invoiceItems.length > 0 && (
                  <button onClick={() => { setPendingReview([]); setTab("invoice"); }} style={{ marginTop: 16, padding: "10px 20px", background: C.accent, border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
                    Voir la facture ({invoiceItems.length} items confirmés) →
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* INVOICE TAB */}
        {tab === "invoice" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                ["Facture #", invoiceNum, setInvoiceNum],
                ["Client / Société", clientName, setClientName],
                ["Adresse des travaux", jobAddress, setJobAddress],
                ["Description du travail", jobDesc, setJobDesc],
              ].map(([label, val, setter]) => (
                <div key={label}>
                  <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, color: C.textMuted, marginBottom: 6, textTransform: "uppercase" }}>{label}</div>
                  <input
                    value={val}
                    onChange={e => setter(e.target.value)}
                    style={{
                      width: "100%", background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: 6, padding: "9px 12px", color: C.text,
                      fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                  />
                </div>
              ))}
            </div>

            <div id="invoice-print">
              <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#e8f2fb" }}>
                      {["Code", "Dim", "Description", "Catégorie", "Qté", "Prix unit.", "Total", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 11, fontWeight: 600, letterSpacing: 0.5, color: C.textMuted, textAlign: "left", borderBottom: `1px solid ${C.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: C.textLight, fontSize: 13 }}>
                        Aucun article — parsez vos notes ou ajoutez depuis le catalogue
                      </td></tr>
                    )}
                    {invoiceItems.map((item, idx) => (
                      <tr key={item.id} style={{ borderBottom: `1px solid ${C.rowBorder}`, background: idx % 2 === 0 ? C.card : C.rowAlt }}>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: C.textLight }}>{item.product.code}</td>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: C.textMuted }}>{item.product.dim}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: C.text, fontWeight: 500 }}>{item.product.name}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: CAT_COLORS[item.product.category] + "22", color: CAT_COLORS[item.product.category] }}>
                            {item.product.category}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e => updateQty(item.id, e.target.value)}
                            onBlur={e => commitQty(item.id, e.target.value)}
                            step="0.25"
                            min="0"
                            style={{
                              width: 70, background: C.inputBg, border: `1px solid ${C.border}`,
                              borderRadius: 5, padding: "4px 8px", color: C.text,
                              fontFamily: "inherit", fontSize: 13, textAlign: "center", outline: "none"
                            }}
                          />
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: C.textMuted }}>{fmt(item.product.sell)}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 700, color: C.accent }}>{fmt(item.qty * item.product.sell)}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: C.textLight, cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <div style={{ width: 340, background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.rowBorder}`, fontSize: 13, color: C.textMuted }}>
                    <span>Sous-total</span><span>{fmt(subtotalBase)}</span>
                  </div>
                  {margeBonus > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.rowBorder}`, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                      <span>📈 Marge +{Math.round(margeBonus * 100)}%</span><span>+{fmt(bonusAmount)}</span>
                    </div>
                  )}
                  {[["TPS (5%)", tps], ["TVQ (9.975%)", tvq]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.rowBorder}`, fontSize: 13, color: C.textMuted }}>
                      <span>{label}</span><span>{fmt(val)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 0 0", fontSize: 20, fontWeight: 700 }}>
                    <span style={{ color: C.text }}>TOTAL</span><span style={{ color: C.accent }}>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
              {/* Marge bonus buttons - visible app seulement */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, whiteSpace: "nowrap" }}>📈 Marge :</span>
                {[0, 5, 10, 15, 20].map(pct => (
                  <button key={pct} onClick={() => setMargeBonus(pct / 100)}
                    style={{ padding: "6px 10px", background: margeBonus === pct / 100 ? (pct === 0 ? C.inputBg : "#16a34a") : C.inputBg,
                      border: `2px solid ${margeBonus === pct / 100 ? (pct === 0 ? C.border : "#16a34a") : C.border}`,
                      borderRadius: 6, color: margeBonus === pct / 100 ? (pct === 0 ? C.textMuted : "white") : C.textMuted,
                      cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
                    {pct === 0 ? "—" : `+${pct}%`}
                  </button>
                ))}
              </div>
              <button onClick={() => setTab("catalog")} style={{ padding: "10px 20px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                + Ajouter depuis catalogue
              </button>
              <button onClick={saveToWeeklyReport} disabled={invoiceItems.length === 0} style={{ padding: "10px 20px", background: invoiceItems.length === 0 ? C.inputBg : "#16a34a", border: "none", borderRadius: 6, color: invoiceItems.length === 0 ? C.textLight : "white", cursor: invoiceItems.length === 0 ? "not-allowed" : "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>
                📊 Ajouter au rapport semaine
              </button>
              <button onClick={printInvoice} style={{ padding: "10px 24px", background: C.accent, border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700, boxShadow: "0 2px 6px rgba(26,107,181,0.3)" }}>
                🖨️ Imprimer / PDF
              </button>
              {invoiceItems.length > 0 && (
                <button onClick={() => { if (window.confirm('Effacer la liste actuelle et commencer une nouvelle facture?')) { setInvoiceItems([]); setClientName(''); setJobAddress(''); setJobDesc(''); setInvoiceNum('001'); setMargeBonus(0); setTab('parse'); } }} style={{ padding: "10px 16px", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                  🗑️ Nouvelle facture
                </button>
              )}
              {saveStatus && <div style={{ fontSize: 13, fontWeight: 600, color: saveStatus.startsWith('✅') ? "#16a34a" : "#c0392b" }}>{saveStatus}</div>}
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
                🕐 Listes sauvegardées ({listHistory.length})
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {historySync === 'sync' && <div style={{ fontSize: 12, color: C.textMuted }}>⟳ Synchronisation…</div>}
                {historySync === 'ok' && <div style={{ fontSize: 12, color: '#16a34a' }}>✓ Synchronisé avec tous les appareils</div>}
                {historySync === 'offline' && <div style={{ fontSize: 12, color: '#c0392b' }}>📵 Hors-ligne — local seulement</div>}
                <button onClick={() => syncHistory()} disabled={historySync === 'sync'} style={{ padding: '6px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, opacity: historySync === 'sync' ? 0.5 : 1 }}>🔄 Rafraîchir</button>
              </div>
            </div>
            {listHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: C.textLight, fontSize: 14 }}>
                Aucune liste sauvegardée pour l'instant. Analysez une liste pour commencer.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
                {listHistory.map(entry => {
                  const d = new Date(entry.savedAt);
                  const dateStr = d.toLocaleDateString('fr-CA', { weekday: 'short', month: 'short', day: 'numeric' });
                  const timeStr = d.toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
                  const isEditing = editingHistoryId === entry.id;
                  return (
                    <div key={entry.id} style={{ background: C.card, border: `1px solid ${isEditing ? C.accent : C.border}`, borderRadius: 10, padding: 18, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      {isEditing ? (
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 12 }}>✏️ Modifier les infos client</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 10, marginBottom: 12 }}>
                            {[['Client / Société', 'clientName'], ['Description du travail', 'jobDesc'], ['Facture #', 'invoiceNum']].map(([label, key]) => (
                              <div key={key}>
                                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{label}</div>
                                <input
                                  value={editHistoryForm[key]}
                                  onChange={e => setEditHistoryForm(f => ({ ...f, [key]: e.target.value }))}
                                  style={{ width: '100%', boxSizing: 'border-box', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6, padding: '8px 10px', color: C.text, fontFamily: 'inherit', fontSize: 13, outline: 'none' }}
                                />
                              </div>
                            ))}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => updateHistoryEntry(entry.id, editHistoryForm)} style={{ padding: "8px 18px", background: C.accent, border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
                              ✓ Sauvegarder
                            </button>
                            <button onClick={() => setEditingHistoryId(null)} style={{ padding: "8px 14px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{entry.clientName || 'Sans client'}</div>
                              {entry.jobDesc && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{entry.jobDesc}</div>}
                              {entry.invoiceNum && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>Facture #{entry.invoiceNum}</div>}
                              <div style={{ fontSize: 11, color: C.textLight, marginTop: 4 }}>{dateStr} à {timeStr} · {entry.items.length} articles</div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{new Intl.NumberFormat('fr-CA', { style: 'currency', currency: 'CAD' }).format(entry.total)}</div>
                              <div style={{ fontSize: 10, color: C.textLight }}>taxes incl.</div>
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12, lineHeight: 1.7, borderTop: `1px solid ${C.border}`, paddingTop: 10 }}>
                            {entry.items.slice(0, 4).map(i => `${i.qty}× ${i.product.name}`).join(' · ')}
                            {entry.items.length > 4 && ` · +${entry.items.length - 4} autres`}
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => loadFromHistory(entry)} style={{ flex: 1, padding: "8px 14px", background: C.accent, border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
                              ↩ Charger cette liste
                            </button>
                            <button onClick={() => { setEditingHistoryId(entry.id); setEditHistoryForm({ clientName: entry.clientName || '', jobDesc: entry.jobDesc || '', invoiceNum: entry.invoiceNum || '' }); }} style={{ padding: "8px 12px", background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                              ✏️ Modifier
                            </button>
                            <button onClick={() => deleteFromHistory(entry.id)} style={{ padding: "8px 12px", background: "#fdecea", border: "1px solid #f5c6c6", borderRadius: 6, color: "#c0392b", cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>
                              ✕
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* CATALOG TAB */}
        {tab === "catalog" && (
          <div>
            {/* Search + filters + add button */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou code..."
                style={{
                  flex: 1, minWidth: 200, background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: "9px 14px", color: C.text,
                  fontFamily: "inherit", fontSize: 13, outline: "none",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                }}
              />
              {cats.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                  padding: "8px 14px", background: selectedCat === cat ? (CAT_COLORS[cat] || C.accent) : C.card,
                  border: `1px solid ${selectedCat === cat ? (CAT_COLORS[cat] || C.accent) : C.border}`,
                  borderRadius: 6, color: selectedCat === cat ? "white" : C.textMuted,
                  cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: selectedCat === cat ? 600 : 400
                }}>{cat}</button>
              ))}
              <button onClick={() => { setShowAddForm(p => !p); setAddError(''); }} style={{
                padding: "8px 16px", background: showAddForm ? C.accent : C.card,
                border: `1px solid ${showAddForm ? C.accent : C.border}`,
                borderRadius: 6, color: showAddForm ? "white" : C.accent,
                cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600
              }}>+ Nouveau produit</button>
            </div>

            {/* Add product form */}
            {showAddForm && (
              <div style={{ background: C.card, border: `2px solid ${C.accent}`, borderRadius: 10, padding: 20, marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.accent, marginBottom: 16 }}>➕ Ajouter un nouveau produit</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
                  {[
                    ["Code", "code", "ex: 5001"],
                    ["Nom", "name", "ex: Coude 90 spécial"],
                    ["Dimension", "dim", "ex: 2 pouces"],
                  ].map(([label, field, placeholder]) => (
                    <div key={field}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
                      <input
                        value={newProduct[field]}
                        onChange={e => setNewProduct(p => ({ ...p, [field]: e.target.value }))}
                        placeholder={placeholder}
                        style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Catégorie</div>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}
                      style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    >
                      {["ROUGH ABS", "ROUGH PEX", "FOND DE TERRE", "FINITION"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Coût ($)</div>
                    <input
                      type="number"
                      value={newProduct.cost}
                      onChange={e => setNewProduct(p => ({ ...p, cost: e.target.value }))}
                      placeholder="ex: 12.50"
                      style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, padding: "8px 10px", color: C.text, fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                {newProduct.cost && parseFloat(newProduct.cost) > 0 && (
                  <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
                    Prix de vente calculé: <strong style={{ color: C.accent }}>
                      {fmt(getSellPrice(parseFloat(newProduct.cost), newProduct.category))}
                    </strong> (marge {Math.round((categoryMargins[newProduct.category] ?? DEFAULT_MARGINS[newProduct.category]) * 100)}%)
                  </div>
                )}
                {addError && <div style={{ color: "#c0392b", fontSize: 12, marginBottom: 10, background: "#fdecea", padding: "6px 10px", borderRadius: 5 }}>{addError}</div>}
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={saveCustomProduct} style={{ padding: "9px 20px", background: C.accent, border: "none", borderRadius: 6, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>
                    ✓ Sauvegarder
                  </button>
                  <button onClick={() => { setShowAddForm(false); setAddError(''); }} style={{ padding: "9px 16px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.textLight }}>{filtered.length} produits{Object.keys(customProducts).length > 0 && ` (dont ${Object.keys(customProducts).length} personnalisés)`}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {catalogSync === 'sync' && <div style={{ fontSize: 12, color: C.textMuted }}>⟳ Sync catalogue…</div>}
                {catalogSync === 'ok' && <div style={{ fontSize: 12, color: '#16a34a' }}>✓ Catalogue synchronisé</div>}
                {catalogSync === 'offline' && <div style={{ fontSize: 12, color: '#c0392b' }}>📵 Hors-ligne</div>}
                <button onClick={() => syncCatalog()} disabled={catalogSync === 'sync'} style={{ padding: '6px 12px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 6, color: C.textMuted, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, opacity: catalogSync === 'sync' ? 0.5 : 1 }}>🔄 Rafraîchir</button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {filtered.map(p => {
                const isCustom = !!customProducts[String(p.code)];
                const isEditing = editingCode === String(p.code);

                if (isEditing) return (
                  <div key={p.code} style={{ background: C.card, border: `2px solid ${C.accent}`, borderRadius: 8, padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, marginBottom: 10 }}>✏️ MODIFIER #{p.code}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[["Nom", "name", "text"], ["Dimension", "dim", "text"], ["Coût ($)", "cost", "number"]].map(([label, field, type]) => (
                        <div key={field}>
                          <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3, fontWeight: 600 }}>{label}</div>
                          <input type={type} value={editForm[field]} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))}
                            style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 8px", color: C.text, fontFamily: "inherit", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                        </div>
                      ))}
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3, fontWeight: 600 }}>Catégorie</div>
                        <select value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                          style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, padding: "6px 8px", color: C.text, fontFamily: "inherit", fontSize: 12, outline: "none" }}>
                          {["ROUGH ABS", "ROUGH PEX", "FOND DE TERRE", "FINITION"].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 3, fontWeight: 600 }}>
                          Marge individuelle (%) — <span style={{ fontWeight: 400 }}>laisser vide pour utiliser la marge de la catégorie ({Math.round((categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]) * 100)}%)</span>
                        </div>
                        <input type="number" min="1" max="60" placeholder={`${Math.round((categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]) * 100)} (catégorie)`}
                          value={editForm.overrideMargin ?? ''}
                          onChange={e => setEditForm(f => ({ ...f, overrideMargin: e.target.value === '' ? null : e.target.value }))}
                          style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.accent}`, borderRadius: 5, padding: "6px 8px", color: C.text, fontFamily: "inherit", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                      </div>
                      {editForm.cost && parseFloat(editForm.cost) > 0 && (() => {
                        const overrideMargin = editForm.overrideMargin ? parseFloat(editForm.overrideMargin) / 100 : null;
                        const effectiveMargin = overrideMargin ?? (categoryMargins[editForm.category] ?? DEFAULT_MARGINS[editForm.category]);
                        const sellPrice = getSellPrice(parseFloat(editForm.cost), editForm.category, overrideMargin);
                        return (
                          <div style={{ fontSize: 11, color: C.textMuted, background: C.inputBg, padding: "6px 10px", borderRadius: 5 }}>
                            Prix vente: <strong style={{ color: C.accent }}>{fmt(sellPrice)}</strong>
                            <span style={{ marginLeft: 8 }}>marge: <strong style={{ color: overrideMargin ? "#e67e22" : C.textMuted }}>{Math.round(effectiveMargin * 100)}%{overrideMargin ? " (individuelle)" : " (catégorie)"}</strong></span>
                          </div>
                        );
                      })()}
                      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                        <button onClick={() => saveEdit(String(p.code))} style={{ flex: 1, padding: "7px", background: C.accent, border: "none", borderRadius: 5, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>✓ Sauver</button>
                        <button onClick={() => setEditingCode(null)} style={{ flex: 1, padding: "7px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Annuler</button>
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={p.code} style={{
                    background: C.card, border: `1px solid ${isCustom ? C.accent : C.border}`, borderRadius: 8,
                    padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3, color: C.text }}>
                        {p.name}
                        {isCustom && <span style={{ fontSize: 9, background: C.accent, color: "white", borderRadius: 3, padding: "1px 5px", marginLeft: 6, fontWeight: 700 }}>CUSTOM</span>}
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: C.textLight }}>#{p.code}</span>
                        <span style={{ fontSize: 11, color: C.textLight }}>{p.dim}</span>
                        <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 3, background: (CAT_COLORS[p.category] || C.accent) + "22", color: CAT_COLORS[p.category] || C.accent, fontWeight: 600 }}>{p.category}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: C.accent, marginBottom: 2 }}>{fmt(p.sell)}</div>
                      <div style={{ fontSize: 10, color: C.textLight, marginBottom: 6 }}>coût: {fmt(p.cost)}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => startEdit(p)} style={{ padding: "4px 8px", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, color: C.textMuted, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>✏️</button>
                        {isCustom && (
                          <button onClick={() => deleteCustomProduct(String(p.code))} style={{ padding: "4px 8px", background: "#fdecea", border: "1px solid #f5c6c6", borderRadius: 5, color: "#c0392b", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>✕</button>
                        )}
                        <button onClick={() => { addProduct(p.code); setTab("invoice"); }}
                          style={{ padding: "5px 12px", background: C.accent, border: "none", borderRadius: 5, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600 }}>+ Ajouter</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        )}

        {/* MARGINS TAB */}
        {tab === "margins" && (() => {
          const cats = ["ROUGH ABS", "ROUGH PEX", "FOND DE TERRE", "FINITION"];
          return (
            <div style={{ maxWidth: 700 }}>
              <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.5, color: C.accent, marginBottom: 20, textTransform: "uppercase" }}>Configuration des marges de profit</div>

              {/* Category margins */}
              <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 24, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Marges par catégorie</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Ces marges s'appliquent à tous les produits de la catégorie, sauf si une marge individuelle est définie.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {cats.map(cat => {
                    const current = categoryMargins[cat] ?? DEFAULT_MARGINS[cat];
                    return (
                      <div key={cat} style={{ display: "grid", gridTemplateColumns: "180px 1fr 80px 100px", gap: 12, alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: CAT_COLORS[cat], display: "inline-block" }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{cat}</span>
                        </div>
                        <input
                          type="range" min="1" max="60" value={Math.round(current * 100)}
                          onChange={e => saveCategoryMargins({ ...categoryMargins, [cat]: parseFloat(e.target.value) / 100 })}
                          style={{ accentColor: CAT_COLORS[cat], cursor: "pointer" }}
                        />
                        <div style={{ textAlign: "center" }}>
                          <input
                            type="number" min="1" max="60" value={Math.round(current * 100)}
                            onChange={e => {
                              const v = Math.min(60, Math.max(1, parseInt(e.target.value) || 1));
                              saveCategoryMargins({ ...categoryMargins, [cat]: v / 100 });
                            }}
                            style={{ width: "100%", background: C.inputBg, border: `1px solid ${C.border}`, borderRadius: 5, padding: "5px 8px", color: C.text, fontFamily: "inherit", fontSize: 13, textAlign: "center", outline: "none" }}
                          />
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted, textAlign: "center" }}>
                          % marge <span style={{ color: CAT_COLORS[cat], fontWeight: 700 }}>{Math.round(current * 100)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, padding: "10px 14px", background: C.inputBg, borderRadius: 6, border: `1px solid ${C.border}`, fontSize: 12, color: C.textMuted }}>
                  ℹ️ La marge est calculée sur le prix de vente: <code style={{ background: C.card, padding: "1px 5px", borderRadius: 3 }}>prix vente = coût ÷ (1 − marge)</code>. Une marge de 30% sur un item de 10$ donne 14.29$.
                </div>
              </div>

              {/* Individual overrides */}
              <div style={{ background: C.card, borderRadius: 10, border: `1px solid ${C.border}`, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 4 }}>Marges individuelles</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
                  Pour modifier la marge d'un produit spécifique, cliquez ✏️ sur le produit dans le <button onClick={() => setTab("catalog")} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontFamily: "inherit", fontSize: 12, padding: 0, fontWeight: 600 }}>Catalogue</button> et ajustez le % de marge.
                </div>
                {(() => {
                  const withOverride = Object.values(customProducts).filter(p => p.overrideMargin != null);
                  if (withOverride.length === 0) return <div style={{ color: C.textLight, fontSize: 13 }}>Aucune marge individuelle définie pour l'instant.</div>;
                  return (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {withOverride.map(p => (
                        <div key={p.code} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: C.inputBg, borderRadius: 6, border: `1px solid ${C.border}` }}>
                          <div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</span>
                            <span style={{ fontSize: 11, color: C.textMuted, marginLeft: 8 }}>#{p.code} · {p.category}</span>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: CAT_COLORS[p.category] }}>{Math.round(p.overrideMargin * 100)}% <span style={{ fontSize: 11, color: C.textMuted, fontWeight: 400 }}>(cat: {Math.round((categoryMargins[p.category] ?? DEFAULT_MARGINS[p.category]) * 100)}%)</span></div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
