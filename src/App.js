import { useState, useRef, useCallback } from "react";

const PRODUCTS = {"1001": {"code": 1001, "dim": "1.5", "name": "Coupling", "cost": 1.0, "sell": 1.43, "category": "ROUGH ABS"}, "1002": {"code": 1002, "dim": "1.5", "name": "Coude 90", "cost": 1.21, "sell": 1.73, "category": "ROUGH ABS"}, "1003": {"code": 1003, "dim": "1.5", "name": "Coude 45", "cost": 1.0, "sell": 1.43, "category": "ROUGH ABS"}, "1004": {"code": 1004, "dim": "1.5", "name": "Coude 22.5", "cost": 1.75, "sell": 2.5, "category": "ROUGH ABS"}, "1005": {"code": 1005, "dim": "1.5", "name": "Bushing Reduit 2x 1 1/2", "cost": 2.0, "sell": 2.86, "category": "ROUGH ABS"}, "1006": {"code": 1006, "dim": "1.5", "name": "Coupling Reduit 2x1 1/2", "cost": 3.0, "sell": 4.29, "category": "ROUGH ABS"}, "1007": {"code": 1007, "dim": "1.5", "name": "P-Trap Collée", "cost": 5.0, "sell": 7.14, "category": "ROUGH ABS"}, "1008": {"code": 1008, "dim": "1.5", "name": "Cap Solide", "cost": 4.0, "sell": 5.71, "category": "ROUGH ABS"}, "1009": {"code": 1009, "dim": "1.5", "name": "Adapteur femelle", "cost": 3.0, "sell": 4.29, "category": "ROUGH ABS"}, "1010": {"code": 1010, "dim": "1.5", "name": "Adapteur male", "cost": 2.5, "sell": 3.57, "category": "ROUGH ABS"}, "1011": {"code": 1011, "dim": "1 1\\2", "name": "Clapet", "cost": 21.5, "sell": 25.29, "category": "FINITION"}, "1012": {"code": 1012, "dim": "1.5", "name": "TY", "cost": 2.0, "sell": 2.86, "category": "ROUGH ABS"}, "1013": {"code": 1013, "dim": "1.5", "name": "Y", "cost": 2.0, "sell": 2.86, "category": "ROUGH ABS"}, "1014": {"code": 1014, "dim": "1.5", "name": "Longueur 12'", "cost": 23.19, "sell": 33.13, "category": "ROUGH ABS"}, "1015": {"code": 1015, "dim": "2", "name": "Coupling", "cost": 1.15, "sell": 1.64, "category": "ROUGH ABS"}, "1016": {"code": 1016, "dim": "2", "name": "Coude 90", "cost": 2.0, "sell": 2.86, "category": "ROUGH ABS"}, "1017": {"code": 1017, "dim": "2", "name": "Coude 45", "cost": 2.0, "sell": 2.86, "category": "ROUGH ABS"}, "1018": {"code": 1018, "dim": "2", "name": "Coude 22.5", "cost": 3.0, "sell": 4.29, "category": "ROUGH ABS"}, "1019": {"code": 1019, "dim": "2", "name": "P-Trap Collée", "cost": 10.0, "sell": 14.29, "category": "ROUGH ABS"}, "1020": {"code": 1020, "dim": "2", "name": "Cap Solide", "cost": 2.2, "sell": 3.14, "category": "ROUGH ABS"}, "1021": {"code": 1021, "dim": "2", "name": "Clean-out", "cost": 4.0, "sell": 5.71, "category": "ROUGH ABS"}, "1022": {"code": 1022, "dim": "2", "name": "Y 2\"", "cost": 3.9, "sell": 5.57, "category": "ROUGH ABS"}, "1023": {"code": 1023, "dim": "2", "name": "Y 2x2x1 1/2", "cost": 3.66, "sell": 5.23, "category": "ROUGH ABS"}, "1024": {"code": 1024, "dim": "2", "name": "Y 2x1 1/2x 1 1/2", "cost": 4.98, "sell": 7.11, "category": "ROUGH ABS"}, "1025": {"code": 1025, "dim": "2", "name": "TY 2\"", "cost": 4.0, "sell": 5.71, "category": "ROUGH ABS"}, "1026": {"code": 1026, "dim": "2", "name": "TY 2x2x1 1/2", "cost": 3.75, "sell": 5.36, "category": "ROUGH ABS"}, "1027": {"code": 1027, "dim": "2", "name": "TY 2x 1 1/2 x 1 1/2", "cost": 5.0, "sell": 7.14, "category": "ROUGH ABS"}, "1028": {"code": 1028, "dim": "2", "name": "Clapet", "cost": 32.5, "sell": 46.43, "category": "ROUGH ABS"}, "1029": {"code": 1029, "dim": "2", "name": "Longueur 12'", "cost": 32.0, "sell": 45.71, "category": "ROUGH ABS"}, "1030": {"code": 1030, "dim": "2", "name": "Drain douche standard", "cost": 12.5, "sell": 17.86, "category": "ROUGH ABS"}, "1031": {"code": 1031, "dim": "2", "name": "Drain douche Sous-Sol", "cost": 8.9, "sell": 12.71, "category": "ROUGH ABS"}, "1032": {"code": 1032, "dim": "2", "name": "Vent Auto", "cost": 21.0, "sell": 30.0, "category": "ROUGH ABS"}, "1033": {"code": 1033, "dim": "3", "name": "Coupling", "cost": 2.5, "sell": 3.57, "category": "ROUGH ABS"}, "1034": {"code": 1034, "dim": "3", "name": "Coude 90", "cost": 4.53, "sell": 6.47, "category": "ROUGH ABS"}, "1035": {"code": 1035, "dim": "3", "name": "Coude 45", "cost": 4.0, "sell": 5.71, "category": "ROUGH ABS"}, "1036": {"code": 1036, "dim": "3", "name": "Coude 22.5", "cost": 6.0, "sell": 8.57, "category": "ROUGH ABS"}, "1037": {"code": 1037, "dim": "3", "name": "P-Trap Collée", "cost": 25.0, "sell": 35.71, "category": "ROUGH ABS"}, "1038": {"code": 1038, "dim": "3", "name": "Cap Solide", "cost": 9.0, "sell": 12.86, "category": "ROUGH ABS"}, "1039": {"code": 1039, "dim": "3", "name": "Clean-Out", "cost": 15.0, "sell": 21.43, "category": "ROUGH ABS"}, "1040": {"code": 1040, "dim": "3", "name": "Y 3", "cost": 7.5, "sell": 10.71, "category": "ROUGH ABS"}, "1041": {"code": 1041, "dim": "3", "name": "Y 3x2", "cost": 7.0, "sell": 10.0, "category": "ROUGH ABS"}, "1042": {"code": 1042, "dim": "3", "name": "Y 3x1 1/2", "cost": 6.0, "sell": 8.57, "category": "ROUGH ABS"}, "1043": {"code": 1043, "dim": "3", "name": "TY 3x 1 1/2", "cost": 6.0, "sell": 8.57, "category": "ROUGH ABS"}, "1044": {"code": 1044, "dim": "3", "name": "TY 3x2", "cost": 11.0, "sell": 15.71, "category": "ROUGH ABS"}, "1045": {"code": 1045, "dim": "3", "name": "TY 3", "cost": 8.0, "sell": 11.43, "category": "ROUGH ABS"}, "1046": {"code": 1046, "dim": "3", "name": "Clapet", "cost": 32.0, "sell": 45.71, "category": "ROUGH ABS"}, "1047": {"code": 1047, "dim": "3", "name": "Longueur 12'", "cost": 69.46, "sell": 99.23, "category": "ROUGH ABS"}, "1048": {"code": 1048, "dim": "n/a", "name": "Flange standard", "cost": 8.5, "sell": 12.14, "category": "ROUGH ABS"}, "1049": {"code": 1049, "dim": "n/a", "name": "Flange fit", "cost": 8.5, "sell": 12.14, "category": "ROUGH ABS"}, "1050": {"code": 1050, "dim": "n/a", "name": "Plomb de toilette 4x3x10", "cost": 43.0, "sell": 61.43, "category": "ROUGH ABS"}, "1051": {"code": 1051, "dim": "2", "name": "Boite Laveuse", "cost": 50.0, "sell": 71.43, "category": "ROUGH ABS"}, "1052": {"code": 1052, "dim": "2", "name": "Boite Laveuse Antibélier", "cost": 70.0, "sell": 100.0, "category": "ROUGH ABS"}, "1053": {"code": 1053, "dim": "1.5", "name": "Drain Bain autoportant 123", "cost": 140.0, "sell": 164.71, "category": "FINITION"}, "1054": {"code": 1054, "dim": "ABS 4\"", "name": "Coupling", "cost": 5.0, "sell": 7.14, "category": "ROUGH ABS"}, "1055": {"code": 1055, "dim": "ABS 4\"", "name": "Coude 90", "cost": 11.5, "sell": 16.43, "category": "ROUGH ABS"}, "1056": {"code": 1056, "dim": "ABS 4\"", "name": "Coude 45", "cost": 10.0, "sell": 14.29, "category": "ROUGH ABS"}, "1057": {"code": 1057, "dim": "ABS 4\"", "name": "Coude 22.5", "cost": 12.0, "sell": 17.14, "category": "ROUGH ABS"}, "1058": {"code": 1058, "dim": "ABS 4\"", "name": "Y", "cost": 22.0, "sell": 31.43, "category": "ROUGH ABS"}, "1059": {"code": 1059, "dim": "ABS 4\"", "name": "TY", "cost": 21.0, "sell": 30.0, "category": "ROUGH ABS"}, "1060": {"code": 1060, "dim": "ABS 4\"", "name": "TY 4X3", "cost": 21.0, "sell": 30.0, "category": "ROUGH ABS"}, "1061": {"code": 1061, "dim": "ABS 4\"", "name": "Y 4x2", "cost": 16.0, "sell": 22.86, "category": "ROUGH ABS"}, "1062": {"code": 1062, "dim": "ABS 4\"", "name": "Y 4x4x3", "cost": 18.0, "sell": 25.71, "category": "ROUGH ABS"}, "1063": {"code": 1063, "dim": "ABS 4\"", "name": "4X3 Bushin", "cost": 10.0, "sell": 14.29, "category": "ROUGH ABS"}, "1064": {"code": 1064, "dim": "ABS 4\"", "name": "Tuyau 12'", "cost": 96.0, "sell": 137.14, "category": "ROUGH ABS"}, "1067": {"code": 1067, "dim": "1.5", "name": "Fernco", "cost": 10.0, "sell": 12.5, "category": "FOND DE TERRE"}, "1068": {"code": 1068, "dim": "2", "name": "Fernco", "cost": 15.0, "sell": 18.75, "category": "FOND DE TERRE"}, "1069": {"code": 1069, "dim": "3", "name": "Fernco", "cost": 20.0, "sell": 25.0, "category": "FOND DE TERRE"}, "1070": {"code": 1070, "dim": "4", "name": "Fernco", "cost": 25.0, "sell": 31.25, "category": "FOND DE TERRE"}, "1071": {"code": 1071, "dim": "5x4", "name": "Fernco", "cost": 30.0, "sell": 37.5, "category": "FOND DE TERRE"}, "1072": {"code": 1072, "dim": "6x4", "name": "Fernco", "cost": 35.0, "sell": 43.75, "category": "FOND DE TERRE"}, "1078": {"code": 1078, "dim": "n/a", "name": "Laine isolante tuyauterie 12pox48po", "cost": 5.0, "sell": 7.14, "category": "ROUGH ABS"}, "1079": {"code": 1079, "dim": "n/a", "name": "Braquette Metallique Ajustable", "cost": 15.0, "sell": 21.43, "category": "ROUGH ABS"}, "1080": {"code": 1080, "dim": "n/a", "name": "Roulette Feuillard", "cost": 8.0, "sell": 11.43, "category": "ROUGH ABS"}, "1081": {"code": 1081, "dim": "n/a", "name": "Canne Urethane", "cost": 12.0, "sell": 17.14, "category": "ROUGH ABS"}, "1082": {"code": 1082, "dim": "n/a", "name": "Gros Tube PL", "cost": 19.0, "sell": 27.14, "category": "ROUGH ABS"}, "1083": {"code": 1083, "dim": "1.5", "name": "Overflow Bain Canplas", "cost": 40.0, "sell": 47.06, "category": "FINITION"}, "1084": {"code": 1084, "dim": "1.5", "name": "Overflow Bain Rubi", "cost": 60.0, "sell": 70.59, "category": "FINITION"}, "1085": {"code": 1085, "dim": "1.5", "name": "Pop Up Drain Bain Seul", "cost": 15.0, "sell": 17.65, "category": "FINITION"}, "2001": {"code": 2001, "dim": "Demi", "name": "Coude 90", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2002": {"code": 2002, "dim": "Demi", "name": "T", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2003": {"code": 2003, "dim": "Demi", "name": "Coupling", "cost": 1.15, "sell": 1.64, "category": "ROUGH PEX"}, "2004": {"code": 2004, "dim": "Demi", "name": "Cap", "cost": 0.75, "sell": 1.07, "category": "ROUGH PEX"}, "2005": {"code": 2005, "dim": "Demi", "name": "Coude Oreille", "cost": 5.15, "sell": 7.36, "category": "ROUGH PEX"}, "2006": {"code": 2006, "dim": "Demi", "name": "Adapteur Mâle", "cost": 2.25, "sell": 3.21, "category": "ROUGH PEX"}, "2007": {"code": 2007, "dim": "Demi", "name": "Adapteur Femelle", "cost": 1.75, "sell": 2.5, "category": "ROUGH PEX"}, "2008": {"code": 2008, "dim": "Demi", "name": "Adapteur soudé", "cost": 1.0, "sell": 1.43, "category": "ROUGH PEX"}, "2009": {"code": 2009, "dim": "Demi", "name": "Adapt. Chauffe-eau", "cost": 3.9, "sell": 5.57, "category": "ROUGH PEX"}, "2010": {"code": 2010, "dim": "Demi", "name": "Bague", "cost": 0.25, "sell": 0.36, "category": "ROUGH PEX"}, "2011": {"code": 2011, "dim": "Demi", "name": "J-Clip", "cost": 0.16, "sell": 0.23, "category": "ROUGH PEX"}, "2012": {"code": 2012, "dim": "Demi", "name": "Ball Valve", "cost": 12.0, "sell": 17.14, "category": "ROUGH PEX"}, "2013": {"code": 2013, "dim": "Demi", "name": "Tuyau 10'", "cost": 5.0, "sell": 7.14, "category": "ROUGH PEX"}, "2014": {"code": 2014, "dim": "Trois-Quart", "name": "Coude 90", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2015": {"code": 2015, "dim": "Trois-Quart", "name": "T", "cost": 2.75, "sell": 3.93, "category": "ROUGH PEX"}, "2016": {"code": 2016, "dim": "Trois-Quart", "name": "T 3/4 x 1/2", "cost": 2.95, "sell": 4.21, "category": "ROUGH PEX"}, "2017": {"code": 2017, "dim": "Trois-Quart", "name": "T 3/4 X 1/2 X 1/2", "cost": 3.75, "sell": 5.36, "category": "ROUGH PEX"}, "2018": {"code": 2018, "dim": "Trois-Quart", "name": "Coupling", "cost": 1.75, "sell": 2.5, "category": "ROUGH PEX"}, "2019": {"code": 2019, "dim": "Trois-Quart", "name": "Cap", "cost": 1.75, "sell": 2.5, "category": "ROUGH PEX"}, "2020": {"code": 2020, "dim": "Trois-Quart", "name": "Reduit 3/4 x 1/2", "cost": 1.9, "sell": 2.71, "category": "ROUGH PEX"}, "2021": {"code": 2021, "dim": "Trois-Quart", "name": "Adapt. Chauffe-eau", "cost": 5.0, "sell": 7.14, "category": "ROUGH PEX"}, "2022": {"code": 2022, "dim": "Trois-Quart", "name": "Bague", "cost": 0.3, "sell": 0.43, "category": "ROUGH PEX"}, "2023": {"code": 2023, "dim": "Trois-Quart", "name": "J-Clip", "cost": 0.3, "sell": 0.43, "category": "ROUGH PEX"}, "2024": {"code": 2024, "dim": "Trois-Quart", "name": "Ball Valve", "cost": 13.5, "sell": 19.29, "category": "ROUGH PEX"}, "2025": {"code": 2025, "dim": "Trois-Quart", "name": "Adapt. Soudé", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2026": {"code": 2026, "dim": "Trois-Quart", "name": "Tuyau 10'", "cost": 7.0, "sell": 10.0, "category": "ROUGH PEX"}, "2027": {"code": 2027, "dim": "n/a", "name": "Boite Valve Eau Frigo", "cost": 40.0, "sell": 57.14, "category": "ROUGH PEX"}, "2028": {"code": 2028, "dim": "n/a", "name": "Sortie eau ball valve", "cost": 45.0, "sell": 64.29, "category": "ROUGH PEX"}, "2029": {"code": 2029, "dim": "n/a", "name": "Sortie eau régulière", "cost": 28.0, "sell": 40.0, "category": "ROUGH PEX"}, "2030": {"code": 2030, "dim": "Demi", "name": "Coude 90 UPONOR", "cost": 2.0, "sell": 2.86, "category": "ROUGH PEX"}, "2031": {"code": 2031, "dim": "Demi", "name": "T UPONOR", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2032": {"code": 2032, "dim": "Demi", "name": "Coupling UPONOR", "cost": 1.75, "sell": 2.5, "category": "ROUGH PEX"}, "2033": {"code": 2033, "dim": "Demi", "name": "Cap UPONOR", "cost": 1.2, "sell": 1.71, "category": "ROUGH PEX"}, "2034": {"code": 2034, "dim": "Demi", "name": "Coude Oreille UPONOR", "cost": 13.5, "sell": 19.29, "category": "ROUGH PEX"}, "2035": {"code": 2035, "dim": "Demi", "name": "Adapteur Mâle UPONOR", "cost": 5.12, "sell": 7.31, "category": "ROUGH PEX"}, "2036": {"code": 2036, "dim": "Demi", "name": "Adapteur Femelle UPONOR", "cost": 11.7, "sell": 16.71, "category": "ROUGH PEX"}, "2037": {"code": 2037, "dim": "Demi", "name": "Adapteur soudé UPONOR", "cost": 4.0, "sell": 5.71, "category": "ROUGH PEX"}, "2038": {"code": 2038, "dim": "Demi", "name": "Adapt. Chauffe-eau UPONOR", "cost": 16.0, "sell": 22.86, "category": "ROUGH PEX"}, "2039": {"code": 2039, "dim": "Demi", "name": "Bague UPONOR", "cost": 0.5, "sell": 0.71, "category": "ROUGH PEX"}, "2040": {"code": 2040, "dim": "Demi", "name": "Ball Valve UPONOR", "cost": 11.0, "sell": 15.71, "category": "ROUGH PEX"}, "2041": {"code": 2041, "dim": "Demi", "name": "Tuyau 20' UPONOR", "cost": 11.0, "sell": 15.71, "category": "ROUGH PEX"}, "2042": {"code": 2042, "dim": "Trois-Quart", "name": "Coude 90 UPONOR", "cost": 3.75, "sell": 5.36, "category": "ROUGH PEX"}, "2043": {"code": 2043, "dim": "Trois-Quart", "name": "T UPONOR", "cost": 5.0, "sell": 7.14, "category": "ROUGH PEX"}, "2044": {"code": 2044, "dim": "Trois-Quart", "name": "T 3/4 x 1/2 UPONOR", "cost": 4.0, "sell": 5.71, "category": "ROUGH PEX"}, "2045": {"code": 2045, "dim": "Trois-Quart", "name": "T 3/4 X 1/2 X 1/2 UPONOR", "cost": 3.5, "sell": 5.0, "category": "ROUGH PEX"}, "2046": {"code": 2046, "dim": "Trois-Quart", "name": "Coupling UPONOR", "cost": 2.5, "sell": 3.57, "category": "ROUGH PEX"}, "2047": {"code": 2047, "dim": "Trois-Quart", "name": "Cap UPONOR", "cost": 2.0, "sell": 2.86, "category": "ROUGH PEX"}, "2048": {"code": 2048, "dim": "Trois-Quart", "name": "Reduit 3/4 x 1/2 UPONOR", "cost": 5.5, "sell": 7.86, "category": "ROUGH PEX"}, "2049": {"code": 2049, "dim": "Trois-Quart", "name": "Adapt. Chauffe-eau UPONOR", "cost": 12.0, "sell": 17.14, "category": "ROUGH PEX"}, "2050": {"code": 2050, "dim": "Trois-Quart", "name": "Bague UPONOR", "cost": 0.5, "sell": 0.71, "category": "ROUGH PEX"}, "2051": {"code": 2051, "dim": "Trois-Quart", "name": "Ball Valve UPONOR", "cost": 20.0, "sell": 28.57, "category": "ROUGH PEX"}, "2052": {"code": 2052, "dim": "Trois-Quart", "name": "Adapt. Soudé UPONOR", "cost": 8.8, "sell": 12.57, "category": "ROUGH PEX"}, "2053": {"code": 2053, "dim": "Trois-Quart", "name": "Tuyau 20' UPONOR", "cost": 23.38, "sell": 33.4, "category": "ROUGH PEX"}, "2054": {"code": 2054, "dim": "POUCE", "name": "Coude 90 UPONOR", "cost": 7.25, "sell": 10.36, "category": "ROUGH PEX"}, "2055": {"code": 2055, "dim": "POUCE", "name": "T UPONOR", "cost": 10.75, "sell": 15.36, "category": "ROUGH PEX"}, "2056": {"code": 2056, "dim": "POUCE", "name": "T 1 x 1 x 3/4 UPONOR", "cost": 10.25, "sell": 14.64, "category": "ROUGH PEX"}, "2057": {"code": 2057, "dim": "POUCE", "name": "T 1 x 3/4 x 3/4 UPONOR", "cost": 10.0, "sell": 14.29, "category": "ROUGH PEX"}, "2058": {"code": 2058, "dim": "POUCE", "name": "Coupling UPONOR", "cost": 4.0, "sell": 5.71, "category": "ROUGH PEX"}, "2059": {"code": 2059, "dim": "POUCE", "name": "Cap UPONOR", "cost": 3.5, "sell": 5.0, "category": "ROUGH PEX"}, "2060": {"code": 2060, "dim": "POUCE", "name": "Reduit 1  x 3/4 UPONOR", "cost": 7.5, "sell": 10.71, "category": "ROUGH PEX"}, "2061": {"code": 2061, "dim": "POUCE", "name": "Adapteur Femelle UPONOR", "cost": 25.0, "sell": 35.71, "category": "ROUGH PEX"}, "2062": {"code": 2062, "dim": "POUCE", "name": "Bague UPONOR", "cost": 1.41, "sell": 2.01, "category": "ROUGH PEX"}, "2063": {"code": 2063, "dim": "POUCE", "name": "J-Clip UPONOR", "cost": 0.25, "sell": 0.36, "category": "ROUGH PEX"}, "2064": {"code": 2064, "dim": "POUCE", "name": "Ball Valve UPONOR", "cost": 25.0, "sell": 35.71, "category": "ROUGH PEX"}, "2065": {"code": 2065, "dim": "POUCE", "name": "Adapt. Soudé UPONOR", "cost": 14.0, "sell": 20.0, "category": "ROUGH PEX"}, "2066": {"code": 2066, "dim": "POUCE", "name": "Adapteur Mâle UPONOR", "cost": 25.0, "sell": 35.71, "category": "ROUGH PEX"}, "2067": {"code": 2067, "dim": "POUCE", "name": "Tuyau 20' UPONOR", "cost": 38.0, "sell": 54.29, "category": "ROUGH PEX"}, "2068": {"code": 2068, "dim": "Demi", "name": "Coude 90 PROPRESS", "cost": 5.0, "sell": 7.14, "category": "ROUGH PEX"}, "2069": {"code": 2069, "dim": "Demi", "name": "T PROPRESS", "cost": 7.0, "sell": 10.0, "category": "ROUGH PEX"}, "2071": {"code": 2071, "dim": "Demi", "name": "Coupling PROPRESS", "cost": 4.0, "sell": 5.71, "category": "ROUGH PEX"}, "2072": {"code": 2072, "dim": "Demi", "name": "Cap PROPRESS", "cost": 7.0, "sell": 10.0, "category": "ROUGH PEX"}, "2073": {"code": 2073, "dim": "Demi", "name": "Coude Oreille PROPRESS", "cost": 15.0, "sell": 21.43, "category": "ROUGH PEX"}, "2074": {"code": 2074, "dim": "Demi", "name": "Adapteur Mâle PROPRESS", "cost": 6.0, "sell": 8.57, "category": "ROUGH PEX"}, "2075": {"code": 2075, "dim": "Demi", "name": "Adapteur Femelle PROPRESS", "cost": 9.0, "sell": 12.86, "category": "ROUGH PEX"}, "2076": {"code": 2076, "dim": "Demi", "name": "Adapteur PEX x PROPRESS", "cost": 13.0, "sell": 18.57, "category": "ROUGH PEX"}, "2077": {"code": 2077, "dim": "Demi", "name": "Adapt. Chauffe-eau PROPRESS", "cost": 19.0, "sell": 27.14, "category": "ROUGH PEX"}, "2078": {"code": 2078, "dim": "Demi", "name": "Adapt UPONORxPROPRESS", "cost": 10.0, "sell": 14.29, "category": "ROUGH PEX"}, "2079": {"code": 2079, "dim": "Demi", "name": "Support Cloué COP", "cost": 0.3, "sell": 0.43, "category": "ROUGH PEX"}, "2080": {"code": 2080, "dim": "Demi", "name": "Ball Valve PROPRESS", "cost": 25.0, "sell": 35.71, "category": "ROUGH PEX"}, "2081": {"code": 2081, "dim": "Demi", "name": "Tuyau 10' COP", "cost": 25.16, "sell": 35.94, "category": "ROUGH PEX"}, "2082": {"code": 2082, "dim": "Trois-Quart", "name": "Coude 90 PROPRESS", "cost": 7.25, "sell": 10.36, "category": "ROUGH PEX"}, "2083": {"code": 2083, "dim": "Trois-Quart", "name": "T PROPRESS", "cost": 12.0, "sell": 17.14, "category": "ROUGH PEX"}, "2084": {"code": 2084, "dim": "Trois-Quart", "name": "T 3/4 x 1/2 PROPRESS", "cost": 11.0, "sell": 15.71, "category": "ROUGH PEX"}, "2085": {"code": 2085, "dim": "Trois-Quart", "name": "T 3/4 X 1/2 X 1/2 PROPRESS", "cost": 10.25, "sell": 14.64, "category": "ROUGH PEX"}, "2086": {"code": 2086, "dim": "Trois-Quart", "name": "Coupling PROPRESS", "cost": 6.0, "sell": 8.57, "category": "ROUGH PEX"}, "2087": {"code": 2087, "dim": "Trois-Quart", "name": "Cap PROPRESS", "cost": 11.75, "sell": 16.79, "category": "ROUGH PEX"}, "2088": {"code": 2088, "dim": "Trois-Quart", "name": "Reduit 3/4 x 1/2 PROPRESS", "cost": 5.0, "sell": 7.14, "category": "ROUGH PEX"}, "2089": {"code": 2089, "dim": "Trois-Quart", "name": "Adapt. Chauffe-eau PROPRESS", "cost": 16.0, "sell": 22.86, "category": "ROUGH PEX"}, "2090": {"code": 2090, "dim": "Trois-Quart", "name": "Ball Valve PROPRESS", "cost": 30.0, "sell": 42.86, "category": "ROUGH PEX"}, "2091": {"code": 2091, "dim": "Trois-Quart", "name": "Adapt. UPONORxPROPRESS", "cost": 12.0, "sell": 17.14, "category": "ROUGH PEX"}, "2092": {"code": 2092, "dim": "Trois-Quart", "name": "Tuyau 10' COP", "cost": 65.0, "sell": 92.86, "category": "ROUGH PEX"}, "2093": {"code": 2093, "dim": "Demi", "name": "Coupling UPONOR", "cost": 2.0, "sell": 2.86, "category": "ROUGH PEX"}, "2094": {"code": 2094, "dim": "Demi", "name": "Antibélier UPONOR", "cost": 18.0, "sell": 25.71, "category": "ROUGH PEX"}, "2095": {"code": 2095, "dim": "Demi", "name": "Robinet de purge", "cost": 10.0, "sell": 14.29, "category": "ROUGH PEX"}, "2096": {"code": 2096, "dim": "Demi", "name": "Antibélier uponor A", "cost": 28.0, "sell": 40.0, "category": "ROUGH PEX"}, "3001": {"code": 3001, "dim": "BNQ 4''", "name": "TY", "cost": 5.5, "sell": 6.88, "category": "FOND DE TERRE"}, "3002": {"code": 3002, "dim": "BNQ 4''", "name": "4X3", "cost": 5.75, "sell": 7.19, "category": "FOND DE TERRE"}, "3003": {"code": 3003, "dim": "BNQ 4''", "name": "4X2 bushin", "cost": 4.25, "sell": 5.31, "category": "FOND DE TERRE"}, "3004": {"code": 3004, "dim": "BNQ 4''", "name": "45 Fit", "cost": 2.25, "sell": 2.81, "category": "FOND DE TERRE"}, "3005": {"code": 3005, "dim": "BNQ 4''", "name": "4X3 Bushin", "cost": 3.5, "sell": 4.38, "category": "FOND DE TERRE"}, "3006": {"code": 3006, "dim": "BNQ 4''", "name": "Tuyau 10'", "cost": 32.0, "sell": 40.0, "category": "FOND DE TERRE"}, "3007": {"code": 3007, "dim": "18x24", "name": "Bassin Sump Pump", "cost": 150.0, "sell": 187.5, "category": "FOND DE TERRE"}, "3008": {"code": 3008, "dim": "18x24", "name": "Couvercle Bassin Garage", "cost": 75.0, "sell": 93.75, "category": "FOND DE TERRE"}, "3009": {"code": 3009, "dim": "18x24", "name": "Couvercle Scellé", "cost": 80.0, "sell": 100.0, "category": "FOND DE TERRE"}, "3010": {"code": 3010, "dim": "12x12", "name": "Frost Pit avec Couvercle", "cost": 100.0, "sell": 125.0, "category": "FOND DE TERRE"}, "3011": {"code": 3011, "dim": "Colle", "name": "Gallon Colle BNQ", "cost": 60.0, "sell": 75.0, "category": "FOND DE TERRE"}, "3012": {"code": 3012, "dim": "Colle", "name": "Gallon Colle Abs", "cost": 60.0, "sell": 75.0, "category": "FOND DE TERRE"}, "3013": {"code": 3013, "dim": "Trois-Quart", "name": "Cop Molle 1 pieds", "cost": 12.0, "sell": 15.0, "category": "FOND DE TERRE"}, "3014": {"code": 3014, "dim": "Trois-Quart", "name": "Union Corporation", "cost": 35.0, "sell": 43.75, "category": "FOND DE TERRE"}, "3015": {"code": 3015, "dim": "1.5", "name": "Pompe 1/2 HP", "cost": 300.0, "sell": 375.0, "category": "FOND DE TERRE"}, "3016": {"code": 3016, "dim": "1.5", "name": "Pompe 1/2 HP ZOELLER", "cost": 400.0, "sell": 500.0, "category": "FOND DE TERRE"}, "3017": {"code": 3017, "dim": "1.5", "name": "Clapet Pompe", "cost": 25.0, "sell": 31.25, "category": "FOND DE TERRE"}, "3018": {"code": 3018, "dim": "n/a", "name": "Tube Ciment Plastique (pitch)", "cost": 7.5, "sell": 9.38, "category": "FOND DE TERRE"}, "3019": {"code": 3019, "dim": "1.25", "name": "Tuyau Evacuation Pompe Flex", "cost": 25.0, "sell": 31.25, "category": "FOND DE TERRE"}, "3020": {"code": 3020, "dim": "1.5", "name": "Pompe Liberty SJ10", "cost": 375.0, "sell": 468.75, "category": "FOND DE TERRE"}, "3021": {"code": 3021, "dim": "BNQ 4''", "name": "Coupling", "cost": 7.0, "sell": 8.75, "category": "FOND DE TERRE"}, "3022": {"code": 3022, "dim": "BNQ 4''", "name": "Coude 90", "cost": 15.0, "sell": 18.75, "category": "FOND DE TERRE"}, "3023": {"code": 3023, "dim": "BNQ 4''", "name": "Coude 45", "cost": 8.0, "sell": 10.0, "category": "FOND DE TERRE"}, "3024": {"code": 3024, "dim": "BNQ 4''", "name": "Coude 22.5", "cost": 8.69, "sell": 10.86, "category": "FOND DE TERRE"}, "3025": {"code": 3025, "dim": "BNQ 4''", "name": "Y", "cost": 12.5, "sell": 15.62, "category": "FOND DE TERRE"}, "3026": {"code": 3026, "dim": "BNQ 4''", "name": "TY", "cost": 15.0, "sell": 18.75, "category": "FOND DE TERRE"}, "3027": {"code": 3027, "dim": "BNQ 4''", "name": "P-Trap Collée", "cost": 30.0, "sell": 37.5, "category": "FOND DE TERRE"}, "3028": {"code": 3028, "dim": "BNQ 4''", "name": "Regard de nettoyage", "cost": 8.0, "sell": 10.0, "category": "FOND DE TERRE"}, "3029": {"code": 3029, "dim": "BNQ 4''", "name": "4X2 bushin", "cost": 10.0, "sell": 12.5, "category": "FOND DE TERRE"}, "3030": {"code": 3030, "dim": "BNQ 4''", "name": "45 Fit", "cost": 7.5, "sell": 9.38, "category": "FOND DE TERRE"}, "3031": {"code": 3031, "dim": "BNQ 4''", "name": "4X3 Bushin", "cost": 11.0, "sell": 13.75, "category": "FOND DE TERRE"}, "3032": {"code": 3032, "dim": "BNQ 4''", "name": "Tuyau 10'", "cost": 32.0, "sell": 40.0, "category": "FOND DE TERRE"}, "4079": {"code": 4079, "dim": "4", "name": "Regard de nettoyage commercial", "cost": 35.0, "sell": 41.18, "category": "FINITION"}, "4080": {"code": 4080, "dim": "4", "name": "Clapet Antiretour", "cost": 40.0, "sell": 47.06, "category": "FINITION"}, "3033": {"code": 3033, "dim": "3", "name": "Capuchon FONTE", "cost": 11.75, "sell": 14.69, "category": "FOND DE TERRE"}, "3034": {"code": 3034, "dim": "3", "name": "Y FONTE", "cost": 19.0, "sell": 23.75, "category": "FOND DE TERRE"}, "3035": {"code": 3035, "dim": "3", "name": "TY FONTE", "cost": 19.0, "sell": 23.75, "category": "FOND DE TERRE"}, "3036": {"code": 3036, "dim": "3", "name": "Coude 45 FONTE", "cost": 11.0, "sell": 13.75, "category": "FOND DE TERRE"}, "3037": {"code": 3037, "dim": "3", "name": "Coude 90 FONTE", "cost": 13.0, "sell": 16.25, "category": "FOND DE TERRE"}, "3038": {"code": 3038, "dim": "3", "name": "Y 3x2 FONTE", "cost": 18.0, "sell": 22.5, "category": "FOND DE TERRE"}, "3039": {"code": 3039, "dim": "3", "name": "FERRULE FONTE", "cost": 18.0, "sell": 22.5, "category": "FOND DE TERRE"}, "3040": {"code": 3040, "dim": "2", "name": "FERRULE FONTE", "cost": 6.0, "sell": 7.5, "category": "FOND DE TERRE"}, "3041": {"code": 3041, "dim": "2", "name": "COLLET MJ", "cost": 4.5, "sell": 5.62, "category": "FOND DE TERRE"}, "3042": {"code": 3042, "dim": "3", "name": "COLLET MJ", "cost": 10.0, "sell": 12.5, "category": "FOND DE TERRE"}, "3043": {"code": 3043, "dim": "3", "name": "Longueur 10'", "cost": 80.0, "sell": 100.0, "category": "FOND DE TERRE"}, "3044": {"code": 3044, "dim": "1", "name": "union Corporation", "cost": 45.39, "sell": 56.74, "category": "FOND DE TERRE"}, "3045": {"code": 3045, "dim": "1", "name": "cuivre molle 1 pied", "cost": 11.0, "sell": 13.75, "category": "FOND DE TERRE"}, "3046": {"code": 3046, "dim": "18x24", "name": "Bassin Garage", "cost": 100.0, "sell": 125.0, "category": "FOND DE TERRE"}, "3047": {"code": 3047, "dim": "", "name": "P trap chromé", "cost": 25.0, "sell": 31.25, "category": "FOND DE TERRE"}, "3048": {"code": 3048, "dim": "", "name": "Lame Fonte Diablo", "cost": 19.0, "sell": 23.75, "category": "FOND DE TERRE"}, "4007": {"code": 4007, "dim": "1 1\\2", "name": "Trap adapt", "cost": 3.5, "sell": 4.12, "category": "FINITION"}, "4008": {"code": 4008, "dim": "1 1\\4", "name": "Trap adapt", "cost": 3.75, "sell": 4.41, "category": "FINITION"}, "4009": {"code": 4009, "dim": "1 1\\2", "name": "Y Lave vaiselle", "cost": 6.38, "sell": 7.51, "category": "FINITION"}, "4010": {"code": 4010, "dim": "1 1\\2", "name": "P Trap Ajustable", "cost": 4.5, "sell": 5.29, "category": "FINITION"}, "4093": {"code": 4093, "dim": "na", "name": "rallonge barre thermo", "cost": 40.0, "sell": 47.06, "category": "FINITION"}, "4094": {"code": 4094, "dim": "Demi", "name": "Union Brass", "cost": 8.67, "sell": 10.2, "category": "FINITION"}, "4095": {"code": 4095, "dim": "Demi", "name": "Valve expension Finition", "cost": 20.0, "sell": 23.53, "category": "FINITION"}, "4034": {"code": 4034, "dim": "Demi", "name": "Valve Angle 1/2 x 3/8", "cost": 12.0, "sell": 14.12, "category": "FINITION"}, "4035": {"code": 4035, "dim": "Demi", "name": "Valve Droite 1/1 x 3/8", "cost": 12.0, "sell": 14.12, "category": "FINITION"}, "4036": {"code": 4036, "dim": "Speed Way", "name": "toilette 12", "cost": 11.0, "sell": 12.94, "category": "FINITION"}, "4037": {"code": 4037, "dim": "Speed Way", "name": "Toilette 20", "cost": 11.5, "sell": 13.53, "category": "FINITION"}, "4038": {"code": 4038, "dim": "Speed Way", "name": "Lavabo 12", "cost": 6.0, "sell": 7.06, "category": "FINITION"}, "4039": {"code": 4039, "dim": "Speed Way", "name": "Lavabo 20", "cost": 8.0, "sell": 9.41, "category": "FINITION"}, "4040": {"code": 4040, "dim": "Speed Way", "name": "Frigo 5'", "cost": 18.0, "sell": 21.18, "category": "FINITION"}, "4041": {"code": 4041, "dim": "Speed Way", "name": "Frigo 10'", "cost": 28.0, "sell": 32.94, "category": "FINITION"}, "4042": {"code": 4042, "dim": "Speed Way", "name": "Lave Vaiselle", "cost": 20.0, "sell": 23.53, "category": "FINITION"}, "4043": {"code": 4043, "dim": "Demi", "name": "Valve Antibélier 1/2 x 3/8", "cost": 17.0, "sell": 20.0, "category": "FINITION"}, "4044": {"code": 4044, "dim": "Demi", "name": "Valve Antibélier 1/2 x 3/8 UPONOR", "cost": 31.0, "sell": 36.47, "category": "FINITION"}, "4045": {"code": 4045, "dim": "Demi", "name": "Flange Chromée", "cost": 4.0, "sell": 4.71, "category": "FINITION"}, "4046": {"code": 4046, "dim": "n/a", "name": "Tube Silicone Clair", "cost": 10.0, "sell": 11.76, "category": "FINITION"}, "4047": {"code": 4047, "dim": "n/a", "name": "Silicone DAP", "cost": 7.5, "sell": 8.82, "category": "FINITION"}, "4048": {"code": 4048, "dim": "n/a", "name": "Roulette Teflon", "cost": 1.0, "sell": 1.18, "category": "FINITION"}, "4049": {"code": 4049, "dim": "4\"", "name": "Flange Brass Pour Plomb Toil.", "cost": 16.5, "sell": 19.41, "category": "FINITION"}, "4050": {"code": 4050, "dim": "4\"", "name": "Flange Sioux Chief Twist N' Set", "cost": 38.0, "sell": 44.71, "category": "FINITION"}, "4051": {"code": 4051, "dim": "n/a", "name": "Bolt Toilette Brass", "cost": 7.89, "sell": 9.28, "category": "FINITION"}, "4052": {"code": 4052, "dim": "n/a", "name": "Bolt Toilette Plastique", "cost": 3.0, "sell": 3.53, "category": "FINITION"}, "4053": {"code": 4053, "dim": "n/a", "name": "Beigne Cire Toilette Regulier", "cost": 3.5, "sell": 4.12, "category": "FINITION"}, "4054": {"code": 4054, "dim": "n/a", "name": "Beigne Cire Toilette Jumbo", "cost": 4.5, "sell": 5.29, "category": "FINITION"}, "4055": {"code": 4055, "dim": "Demi", "name": "Valve Frigo 1/2x1/4", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4056": {"code": 4056, "dim": "24", "name": "Panne Chauffe-Eau 24\"'", "cost": 25.0, "sell": 29.41, "category": "FINITION"}, "4057": {"code": 4057, "dim": "26", "name": "Panne Chauffe-Eau 26\"", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4058": {"code": 4058, "dim": "3\"", "name": "Grille Chromée Drain Plancher", "cost": 10.0, "sell": 11.76, "category": "FINITION"}, "4059": {"code": 4059, "dim": "1\"", "name": "Mammelon Filleté", "cost": 3.0, "sell": 3.53, "category": "FINITION"}, "4060": {"code": 4060, "dim": "1 1\\2", "name": "Mammelon Filleté", "cost": 3.5, "sell": 4.12, "category": "FINITION"}, "4061": {"code": 4061, "dim": "2\"", "name": "Mammelon Filleté", "cost": 3.75, "sell": 4.41, "category": "FINITION"}, "4062": {"code": 4062, "dim": "2.5", "name": "Mammelon Filleté", "cost": 4.0, "sell": 4.71, "category": "FINITION"}, "4063": {"code": 4063, "dim": "3", "name": "Mammelon Filleté", "cost": 4.25, "sell": 5.0, "category": "FINITION"}, "4064": {"code": 4064, "dim": "1.25", "name": "Drain Lavabo Pop-Up", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4065": {"code": 4065, "dim": "1.5", "name": "Crepine Evier Kindred", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4066": {"code": 4066, "dim": "1.5", "name": "Tail-Piece 1 1/2 x 6 Brass", "cost": 7.0, "sell": 8.24, "category": "FINITION"}, "1086": {"code": 1086, "dim": "3", "name": "Clapet Compression Rubber", "cost": 25.0, "sell": 29.41, "category": "FINITION"}, "1087": {"code": 1087, "dim": "4", "name": "Clapet Compression Rubber", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4067": {"code": 4067, "dim": "Demi", "name": "Robinet de purge", "cost": 13.0, "sell": 15.29, "category": "FINITION"}, "4068": {"code": 4068, "dim": "Demi", "name": "Sortie Bec de Bain", "cost": 7.5, "sell": 8.82, "category": "FINITION"}, "4069": {"code": 4069, "dim": "Demi", "name": "Valve Angle 1/2 x 3/8 PROPRESS", "cost": 22.5, "sell": 26.47, "category": "FINITION"}, "4070": {"code": 4070, "dim": "Demi", "name": "Valve Droite 1/2 x 3/8 PROPRESS", "cost": 22.5, "sell": 26.47, "category": "FINITION"}, "4071": {"code": 4071, "dim": "n/a", "name": "Valve remplissage toilette Korky", "cost": 30.0, "sell": 35.29, "category": "FINITION"}, "4072": {"code": 4072, "dim": "1 1\\2", "name": "P-Trap Ajustable PVC", "cost": 20.0, "sell": 23.53, "category": "FINITION"}, "4073": {"code": 4073, "dim": "1 1\\2", "name": "Coupling PVC", "cost": 4.25, "sell": 5.0, "category": "FINITION"}, "4074": {"code": 4074, "dim": "1 1\\2", "name": "Adapteur Siphon 1 1/2 x 1 1/4 PVC", "cost": 10.5, "sell": 12.35, "category": "FINITION"}, "4075": {"code": 4075, "dim": "1.5", "name": "P-Trap Collée  XFR", "cost": 42.5, "sell": 50.0, "category": "FINITION"}, "4076": {"code": 4076, "dim": "1 1\\2", "name": "Coupling XFR", "cost": 7.0, "sell": 8.24, "category": "FINITION"}, "4077": {"code": 4077, "dim": "1 1\\2", "name": "Coude 45 XFR", "cost": 8.0, "sell": 9.41, "category": "FINITION"}, "4078": {"code": 4078, "dim": "1.5", "name": "Longueur Tuyau XFR", "cost": 200.0, "sell": 235.29, "category": "FINITION"}, "4081": {"code": 4081, "dim": "n/a", "name": "Support UNISTRUT 10'", "cost": 40.0, "sell": 47.06, "category": "FINITION"}, "4082": {"code": 4082, "dim": "Trois-Quart", "name": "Ball Valve AQUARISE", "cost": 150.0, "sell": 176.47, "category": "FINITION"}, "4083": {"code": 4083, "dim": "POUCE", "name": "Ball Valve AQUARISE", "cost": 163.0, "sell": 191.76, "category": "FINITION"}, "4084": {"code": 4084, "dim": "1.5", "name": "Ball Valve AQUARISE", "cost": 200.0, "sell": 235.29, "category": "FINITION"}, "4085": {"code": 4085, "dim": "Trois-Quart", "name": "Coude 90 AQUARISE", "cost": 10.0, "sell": 11.76, "category": "FINITION"}, "4086": {"code": 4086, "dim": "POUCE", "name": "T AQUARISE", "cost": 1.0, "sell": 1.18, "category": "FINITION"}, "4087": {"code": 4087, "dim": "POUCE", "name": "Bushing Reduit 1\"x3/4\"", "cost": 12.0, "sell": 14.12, "category": "FINITION"}, "4088": {"code": 4088, "dim": "Demi", "name": "Coude Oreille Cuivre", "cost": 7.75, "sell": 9.12, "category": "FINITION"}, "4089": {"code": 4089, "dim": "60 Gal", "name": "Chauffe-Eau Rheem Professionnal", "cost": 800.0, "sell": 941.18, "category": "FINITION"}, "4090": {"code": 4090, "dim": "40 Gal", "name": "Chauffe-Eau Rheem Professionnal", "cost": 650.0, "sell": 764.71, "category": "FINITION"}, "4091": {"code": 4091, "dim": "Demi", "name": "Hose Flexible Renforcee 1 pi", "cost": 1.5, "sell": 1.76, "category": "FINITION"}, "4092": {"code": 4092, "dim": "n/a", "name": "Extension Flange", "cost": 22.0, "sell": 25.88, "category": "FINITION"}};

const TPS = 0.05;
const TVQ = 0.09975;
const CAT_COLORS = {
  "ROUGH ABS": "#e85d26",
  "ROUGH PEX": "#2563eb",
  "FOND DE TERRE": "#16a34a",
  "FINITION": "#9333ea",
};

const fmt = (n) => `$${n.toFixed(2)}`;

async function parseNotesWithAI(text) {
  const productList = Object.values(PRODUCTS).map(p => `${p.code}: ${p.name} (${p.dim}) [${p.category}]`).join('\n');
  const prompt = `You are a plumbing materials invoice assistant. Parse the following Apple Notes text from a plumber's job site takeoff and extract all materials with quantities.

PRODUCT CATALOG (code: name (dimension) [category]):
${productList}

NOTES TEXT:
${text}

Return ONLY a JSON array with no explanation, no markdown fences. Each item must have:
- "code": product code number (integer) from catalog, or null if not found
- "qty": quantity (integer)
- "note": original text fragment you matched
- "suggested": suggested product name if code found, else the raw item text

Rules:
- Match products by name similarity, even if abbreviations or French variants are used
- Numbers at the start of a line or before a product name are quantities
- If a code is written directly (like "1003"), use it directly
- Be generous with matching - "coude 90" matches any Coude 90 variant
- For ambiguous matches, pick the most common/basic version`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await response.json();
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

export default function App() {
  const [tab, setTab] = useState("parse");
  const [notesText, setNotesText] = useState(SAMPLE_NOTES);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState(null);
  const [clientName, setClientName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [invoiceNum, setInvoiceNum] = useState("001");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCat, setSelectedCat] = useState("ALL");

  const subtotal = invoiceItems.reduce((s, i) => s + i.qty * i.product.sell, 0);
  const tps = subtotal * TPS;
  const tvq = subtotal * TVQ;
  const total = subtotal + tps + tvq;

  const handleParse = async () => {
    if (!notesText.trim()) return;
    setParsing(true);
    setParseError(null);
    try {
      const parsed = await parseNotesWithAI(notesText);
      const items = parsed
        .filter(i => i.code && PRODUCTS[String(i.code)])
        .map(i => ({
          id: Math.random().toString(36).slice(2),
          product: PRODUCTS[String(i.code)],
          qty: i.qty || 1,
          note: i.note,
        }));
      setInvoiceItems(items);
      if (items.length > 0) setTab("invoice");
    } catch (e) {
      setParseError("Erreur de parsing: " + e.message);
    }
    setParsing(false);
  };

  const updateQty = (id, val) => {
    setInvoiceItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, parseInt(val) || 0) } : i));
  };

  const removeItem = (id) => setInvoiceItems(prev => prev.filter(i => i.id !== id));

  const addProduct = (code) => {
    const p = PRODUCTS[String(code)];
    if (!p) return;
    const existing = invoiceItems.find(i => i.product.code === p.code);
    if (existing) {
      setInvoiceItems(prev => prev.map(i => i.id === existing.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setInvoiceItems(prev => [...prev, { id: Math.random().toString(36).slice(2), product: p, qty: 1, note: "" }]);
    }
  };

  const allProducts = Object.values(PRODUCTS);
  const cats = ["ALL", ...new Set(allProducts.map(p => p.category))];
  const filtered = allProducts.filter(p => {
    const matchCat = selectedCat === "ALL" || p.category === selectedCat;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(p.code).includes(searchTerm);
    return matchCat && matchSearch;
  });

  const printInvoice = () => {
    const printContent = document.getElementById("invoice-print");
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Facture ${invoiceNum}</title><style>
      body{font-family:Arial,sans-serif;padding:20px;color:#1a1a1a}
      table{width:100%;border-collapse:collapse}th,td{padding:8px;border-bottom:1px solid #e5e7eb;text-align:left}
      th{background:#f9fafb;font-weight:600}tr:last-child td{border:none}
      .total-row{font-weight:700;font-size:1.1em}.header{margin-bottom:24px}
      h1{font-size:1.5em;margin:0 0 4px}p{margin:2px 0;color:#555}
      .grand-total{background:#1a1a1a;color:white;padding:12px;border-radius:6px;text-align:right;font-size:1.2em;font-weight:700;margin-top:12px}
    </style></head><body>${printContent.innerHTML}</body></html>`);
    w.document.close();
    w.print();
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", fontFamily: "'Courier New', monospace", color: "#e8e8e8" }}>
      {/* Header */}
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #2a2a2a", padding: "0 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "#e85d26", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔧</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1 }}>PLUMB<span style={{ color: "#e85d26" }}>INVOICE</span></div>
              <div style={{ fontSize: 10, color: "#666", letterSpacing: 2 }}>SYSTÈME DE FACTURATION</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {[["parse", "📋 NOTES"], ["invoice", `🧾 FACTURE (${invoiceItems.length})`], ["catalog", "📦 CATALOGUE"]].map(([id, label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: "8px 16px", background: tab === id ? "#e85d26" : "transparent",
                border: `1px solid ${tab === id ? "#e85d26" : "#333"}`,
                borderRadius: 4, color: tab === id ? "white" : "#888",
                cursor: "pointer", fontSize: 11, letterSpacing: 1, fontFamily: "inherit"
              }}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>

        {/* PARSE TAB */}
        {tab === "parse" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#e85d26", marginBottom: 12 }}>NOTES APPLE / TAKEOFF</div>
              <textarea
                value={notesText}
                onChange={e => setNotesText(e.target.value)}
                placeholder="Collez votre liste de matériaux ici..."
                style={{
                  width: "100%", height: 400, background: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRadius: 8, padding: 16, color: "#e8e8e8", fontFamily: "inherit",
                  fontSize: 13, resize: "vertical", outline: "none", boxSizing: "border-box"
                }}
              />
              <button
                onClick={handleParse}
                disabled={parsing}
                style={{
                  marginTop: 12, width: "100%", padding: 14,
                  background: parsing ? "#333" : "#e85d26",
                  border: "none", borderRadius: 6, color: "white",
                  fontSize: 13, letterSpacing: 2, fontFamily: "inherit",
                  cursor: parsing ? "not-allowed" : "pointer", fontWeight: 700
                }}
              >
                {parsing ? "⏳ ANALYSE EN COURS..." : "⚡ ANALYSER AVEC L'IA"}
              </button>
              {parseError && <div style={{ marginTop: 8, color: "#ef4444", fontSize: 12 }}>{parseError}</div>}
            </div>
            <div>
              <div style={{ fontSize: 12, letterSpacing: 2, color: "#666", marginBottom: 12 }}>GUIDE D'UTILISATION</div>
              <div style={{ background: "#1a1a1a", borderRadius: 8, padding: 20, border: "1px solid #2a2a2a" }}>
                <div style={{ fontSize: 12, lineHeight: 1.8, color: "#999" }}>
                  <div style={{ color: "#e85d26", marginBottom: 8, fontSize: 13 }}>Comment ça fonctionne:</div>
                  <div>1. Copiez votre liste de matériaux depuis Apple Notes</div>
                  <div>2. Collez le texte dans la zone à gauche</div>
                  <div>3. Cliquez "Analyser avec l'IA"</div>
                  <div>4. L'IA reconnaît les produits et quantités</div>
                  <div>5. Vérifiez et modifiez la facture générée</div>
                  <div style={{ color: "#e85d26", marginTop: 16, marginBottom: 8, fontSize: 13 }}>Formats acceptés:</div>
                  <div style={{ fontFamily: "monospace", background: "#0f0f0f", padding: 12, borderRadius: 4, fontSize: 11 }}>
                    <div>• "6x coude 90 1.5"</div>
                    <div>• "coude 90 - qty: 6"</div>
                    <div>• "1003 x 3" (code direct)</div>
                    <div>• "3 coupling 2 pouces"</div>
                    <div>• Noms français abrégés OK</div>
                  </div>
                  <div style={{ color: "#666", marginTop: 16, fontSize: 11 }}>
                    289 produits dans le catalogue · TPS 5% · TVQ 9.975%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INVOICE TAB */}
        {tab === "invoice" && (
          <div>
            {/* Invoice header form */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              {[
                ["Facture #", invoiceNum, setInvoiceNum],
                ["Client / Société", clientName, setClientName],
                ["Description du travail", jobDesc, setJobDesc],
              ].map(([label, val, setter]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, letterSpacing: 2, color: "#666", marginBottom: 6 }}>{label}</div>
                  <input
                    value={val}
                    onChange={e => setter(e.target.value)}
                    style={{
                      width: "100%", background: "#1a1a1a", border: "1px solid #2a2a2a",
                      borderRadius: 4, padding: "8px 12px", color: "#e8e8e8",
                      fontFamily: "inherit", fontSize: 13, outline: "none", boxSizing: "border-box"
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Printable invoice */}
            <div id="invoice-print">
              <div style={{ background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#111" }}>
                      {["CODE", "DIM", "DESCRIPTION", "CATÉGORIE", "QTÉ", "PRIX UNIT.", "TOTAL", ""].map(h => (
                        <th key={h} style={{ padding: "12px 16px", fontSize: 10, letterSpacing: 2, color: "#666", textAlign: "left", borderBottom: "1px solid #2a2a2a" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.length === 0 && (
                      <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#444", fontSize: 13 }}>
                        Aucun article — parsez vos notes ou ajoutez depuis le catalogue
                      </td></tr>
                    )}
                    {invoiceItems.map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #1f1f1f" }}>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: "#888" }}>{item.product.code}</td>
                        <td style={{ padding: "10px 16px", fontSize: 12, color: "#888" }}>{item.product.dim}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13 }}>{item.product.name}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <span style={{ fontSize: 10, letterSpacing: 1, padding: "2px 8px", borderRadius: 3, background: CAT_COLORS[item.product.category] + "22", color: CAT_COLORS[item.product.category] }}>
                            {item.product.category}
                          </span>
                        </td>
                        <td style={{ padding: "10px 16px" }}>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={e => updateQty(item.id, e.target.value)}
                            style={{
                              width: 60, background: "#0f0f0f", border: "1px solid #333",
                              borderRadius: 4, padding: "4px 8px", color: "#e8e8e8",
                              fontFamily: "inherit", fontSize: 13, textAlign: "center"
                            }}
                          />
                        </td>
                        <td style={{ padding: "10px 16px", fontSize: 13, color: "#aaa" }}>{fmt(item.product.sell)}</td>
                        <td style={{ padding: "10px 16px", fontSize: 13, fontWeight: 600 }}>{fmt(item.qty * item.product.sell)}</td>
                        <td style={{ padding: "10px 16px" }}>
                          <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 16, padding: 0 }}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                <div style={{ width: 320, background: "#1a1a1a", borderRadius: 8, border: "1px solid #2a2a2a", padding: 20 }}>
                  {[["Sous-total", subtotal], ["TPS (5%)", tps], ["TVQ (9.975%)", tvq]].map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1f1f1f", fontSize: 13, color: "#888" }}>
                      <span>{label}</span><span>{fmt(val)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 18, fontWeight: 700 }}>
                    <span>TOTAL</span><span style={{ color: "#e85d26" }}>{fmt(total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <button onClick={() => setTab("catalog")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid #333", borderRadius: 4, color: "#888", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1 }}>
                + AJOUTER DEPUIS CATALOGUE
              </button>
              <button onClick={printInvoice} style={{ padding: "10px 20px", background: "#e85d26", border: "none", borderRadius: 4, color: "white", cursor: "pointer", fontFamily: "inherit", fontSize: 12, letterSpacing: 1, fontWeight: 700 }}>
                🖨️ IMPRIMER / PDF
              </button>
            </div>
          </div>
        )}

        {/* CATALOG TAB */}
        {tab === "catalog" && (
          <div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
              <input
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom ou code..."
                style={{
                  flex: 1, minWidth: 200, background: "#1a1a1a", border: "1px solid #2a2a2a",
                  borderRadius: 4, padding: "8px 12px", color: "#e8e8e8",
                  fontFamily: "inherit", fontSize: 13, outline: "none"
                }}
              />
              {cats.map(cat => (
                <button key={cat} onClick={() => setSelectedCat(cat)} style={{
                  padding: "8px 14px", background: selectedCat === cat ? (CAT_COLORS[cat] || "#e85d26") : "transparent",
                  border: `1px solid ${selectedCat === cat ? (CAT_COLORS[cat] || "#e85d26") : "#333"}`,
                  borderRadius: 4, color: selectedCat === cat ? "white" : "#888",
                  cursor: "pointer", fontSize: 10, letterSpacing: 1, fontFamily: "inherit"
                }}>{cat}</button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: "#444", marginBottom: 12 }}>{filtered.length} produits</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 8 }}>
              {filtered.map(p => (
                <div key={p.code} style={{
                  background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6,
                  padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 13, marginBottom: 2 }}>{p.name}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ fontSize: 10, color: "#555" }}>#{p.code}</span>
                      <span style={{ fontSize: 10, color: "#555" }}>{p.dim}</span>
                      <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 2, background: CAT_COLORS[p.category] + "22", color: CAT_COLORS[p.category] }}>{p.category}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#e85d26", marginBottom: 6 }}>{fmt(p.sell)}</div>
                    <button
                      onClick={() => { addProduct(p.code); setTab("invoice"); }}
                      style={{
                        padding: "4px 12px", background: "#e85d26", border: "none",
                        borderRadius: 3, color: "white", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 11
                      }}
                    >+ Ajouter</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
