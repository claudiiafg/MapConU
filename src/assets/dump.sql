CREATE TABLE IF NOT EXISTS buildinginfo(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    address TEXT
);

CREATE TABLE IF NOT EXISTS buildingcoordinates(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lat REAL,
    lng REAL,
    build_id INTEGER,
    FOREIGN KEY (build_id) REFERENCES buildinginfo(id)
);


/*

name: 'Hall Building',
      address: '1455 De Maisonneeuve Blvd. W.',
      coords: this.hallCoords

       { lat: 45.496836, lng: -73.578858 },
          { lat: 45.497164, lng: -73.579539 },
          { lat: 45.49772, lng: -73.579029 },
          { lat: 45.497385, lng: -73.578348 }

*/

INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (1, 'Hall Building', '1455 De Maisonneuve Blvd. W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (1, 45.496836, -73.578858, 1);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (2, 45.497164, -73.579539, 1);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (3, 45.49772,  -73.579029, 1);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (4, 45.497385, -73.578348, 1);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (2, 'John Molson Building', '1450 Guy St.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (5, 45.495531, -73.579197, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (6, 45.495357, -73.579378, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (7, 45.495222, -73.579117, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (8, 45.495165, -73.579174, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (9, 45.495008, -73.578808, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (10, 45.49504, -73.57878, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (11, 45.495007, -73.578725, 2);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (12, 45.495209, -73.578507, 2);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (3, 'JW McConnell Building', '1400 De Maisonneuve Blvd. W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (13,  45.497285, -73.578091, 3);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (14, 45.496681, -73.578678, 3);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (15, 45.496249, -73.577721, 3);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (16, 45.496497, -73.577474, 3);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (17, 45.496544, -73.577608, 3);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (18, 45.496894, -73.577268, 3);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (4, 'Faubourg Building', '1250 Guy St.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (19, 45.494367, -73.57844, 4);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (20, 45.49419, -73.577981, 4);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (21, 45.49448, -73.577654, 4);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (22, 45.494702, -73.578037, 4);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (5, 'Faubourg Ste Catherine Building', '');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (23, 45.494922, -73.577777, 5);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (24, 45.494653, -73.577217, 5);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (25, 45.494395, -73.577517, 5);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (26, 45.494702, -73.578037, 5);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (6, 'EV Building', '1515 St. Catherine W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (27, 45.496057, -73.577718, 6);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (28, 45.495793, -73.577176, 6);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (29, 45.495143, -73.577821, 6);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (30, 45.495596, -73.578766, 6);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (31, 45.495945, -73.578428, 6);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (32, 45.495736, -73.578031, 6);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (7, 'Guy-De Maisonneuve Building', '1550 De Maisonneuve Blvd. W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (33, 45.495596, -73.578766, 7);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (34, 45.495945, -73.578428, 7);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (35, 45.496125, -73.578814, 7);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (36, 45.495774, -73.579154, 7);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (8, 'Grey Nuns', '1190 Guy St.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (37, 45.493338, -73.576621, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (38, 45.493781, -73.577758, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (39, 45.494406, -73.577115, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (40, 45.494026, -73.576289, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (41, 45.494127, -73.576176, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (42, 45.494026, -73.575993, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (43, 45.493932, -73.57609, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (44, 45.493714, -73.575639, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (45, 45.493571, -73.575784, 8);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (46, 45.49377, -73.576197, 8);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (9, 'Concordia Annexes', '2010-2110 Mackay St.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (47, 45.496721, -73.579157, 9);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (48, 45.497092, -73.579916, 9);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (49, 45.496944, -73.580066, 9);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (50, 45.496563, -73.579303, 9);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (10, 'TD Building', '1410 Guy St.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (51, 45.494734, -73.578952, 10);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (52, 45.494861, -73.578799, 10);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (53, 45.494656, -73.57845, 10);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (54, 45.49454, -73.57861, 10);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (11, 'Visual Arts Building', '1395 Rene Levsque Blvd. W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (55, 45.495392, -73.573756, 11);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (56, 45.495673, -73.574319, 11);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (57, 45.496193, -73.573784, 11);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (58, 45.496073, -73.573539, 11);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (59, 45.49582, -73.573805, 11);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (60, 45.495664, -73.573488, 11);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (12, 'Administration Building', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (61, 45.457922, -73.640125, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (62, 45.457998, -73.640067, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (63, 45.457975, -73.640007, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (64, 45.458281, -73.639775, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (65, 45.458299, -73.639826, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (66, 45.458384, -73.639766, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (67, 45.458268, -73.639468, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (68, 45.458172, -73.639528, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (69, 45.458207, -73.639618, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (70, 45.457912, -73.639848, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (71, 45.457875, -73.639775, 12);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (72, 45.457803, -73.639829, 12);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (13, 'Central Building', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (73, 45.458079, -73.640012, 13);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (74, 45.458366, -73.640796, 13);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (75, 45.458534, -73.640678, 13);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (76, 45.45824, -73.639897, 13);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (14, 'Richard J. Renaud Science Complex', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (77, 45.457213, -73.640656, 14);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (78, 45.457527, -73.641469, 14);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (79, 45.458167, -73.640975, 14);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (80, 45.458329, -73.641415, 14);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (81, 45.457469, -73.642075, 14);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (82, 45.456982, -73.640833, 14);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (15, 'Communication Studies and Journalism Building', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (83, 45.457217, -73.640015, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (84, 45.457362, -73.640074, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (85, 45.457409, -73.640203, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (86, 45.457177, -73.640393, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (87, 45.457311, -73.640734, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (88, 45.457597, -73.640501, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (89, 45.45765, -73.640632, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (90, 45.457828, -73.640479, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (91, 45.457652, -73.640021, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (92, 45.457495, -73.640144, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (93, 45.457439, -73.640026, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (94, 45.457469, -73.639809, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (95, 45.457388, -73.639758, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (96, 45.457285, -73.639795, 15);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (97, 45.457226, -73.639905, 15);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (16, 'Vanier Library', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (98, 45.458869, -73.638234, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (99, 45.458617, -73.638422, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (100, 45.458848, -73.639028, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (101, 45.459047, -73.638862, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (102, 45.459094, -73.638961, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (103, 45.459199, -73.638881, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (104, 45.459161, -73.638779, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (105, 45.459311, -73.638658, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (106, 45.45914, -73.638191, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (107, 45.459222, -73.638127, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (108, 45.459108, -73.637843, 16);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (109, 45.458807, -73.638068, 16);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (17, 'Oscar Peterson Concert Hall', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (110, 45.459161, -73.638779, 17);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (111, 45.459311, -73.638658, 17);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (112, 45.459493, -73.639133, 17);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (113, 45.459347, -73.639245, 17);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (18, 'Student Center', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (114, 45.458964, -73.639054, 18);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (115, 45.459123, -73.63946, 18);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (116, 45.459347, -73.639245, 18);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (117, 45.459199, -73.638881, 18);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (19, 'Psychology Building', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (118, 45.459238, -73.640544, 19);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (119, 45.459083, -73.640149, 19);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (120, 45.45872, -73.640426, 19);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (121, 45.458857, -73.640839, 19);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (20, 'Recreation and Athletics Complex', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (122, 45.456378, -73.637352, 20);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (123, 45.456726, -73.637086, 20);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (124, 45.457195, -73.638339, 20);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (125, 45.456872, -73.63862, 20);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (21, 'Hingston Hall', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (126, 45.458924, -73.641813, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (127, 45.459277, -73.641558, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (128, 45.459127, -73.641165, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (129, 45.459517, -73.640872, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (130, 45.459906, -73.642033, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (131, 45.459631, -73.642295, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (132, 45.459526, -73.642027, 21);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (133, 45.459118, -73.642342, 21);
INSERT or IGNORE INTO buildinginfo(id, name, address) VALUES (22, 'FC Smith Building', '7141 Sherbrooke W.');
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (134, 45.45837, -73.639044, 22);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (135, 45.458551, -73.639624, 22);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (136, 45.458743, -73.639479, 22);
INSERT or IGNORE INTO buildingcoordinates(id, lat, lng, build_id) VALUES (137, 45.458536, -73.638923, 22);
