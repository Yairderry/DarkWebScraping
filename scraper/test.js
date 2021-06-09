const node_ner = require("node-ner");
const fs = require("fs");

const ner = new node_ner({
  install_path: "./stanford-ner-2017-06-09",
});

const text = `Name:
Marcus Brian Page
November 24, 1971 (11/24/71) Age:50
SSN: 578-96-2851
DL: ????

Profile:
Height: 5'9"
Weight: 200
Eyes: Brown
Hair: Black
Ethnicity: African American
Birthplace: Washington, DC

Family Members:
William Theate Page Age: Dead
Elsie R Page   Age: 84
7472 Blair Rd NW, Washington, DC 20012

Current Addresses:
909 Domnus Ln Apt:101 Las Vegas, NV 89144
10020 Benjamin Nicholas Pl, UNIT 201, Las Vegas, NV 89144

Past Addresses:
740 Hunters Creek Ln, Unit 202, Las Vegas, NV 89145
10020 Benjamin Nicholas Pl, Unit 204, Las Vegas, NV 89144
5715 Oak Bend Dr, Las Vegas, NV 89135
3420 Rancher Dr, Reno, NV 89503

Work History:
https://www.linkedin.com/in/pagemarcus

Current Employer:
MassMutual
1980 Festival Plaza, Suite 670
Las Vegas, NV 89135

Insurance License (Nevada):
National Insurance Producer#: 18729787

The Work Number (Experian):
https://secure.theworknumber.com/twneeer/PreAuthenticated/FindEmployer.aspx
Employer: Caesars Entertainment
Code: 10587

Active Phone:
702-334-4017 (AT&T Mobile)

Inactive Phones:
(202) 291-5294
(702) 804-7820
(702) 676-1227
(702) 254-0000
(202) 746-9240
(775) 746-9240
(775) 747-7529

Active Email:
marcuspage5715@gmail.com

Partial Credit Cards:
4080 - 39?? - ???? - 2246 11/22
4270 - 82?? - ???? - 9169  5/23

Known Credit Accounts:
Nationstar (mortgage)
Account Number: *****3844
Liberty Finance (auto)

Credit Karma:
Username: marcuspage5715@gmail.com
Password: ????

Wal-Mart:
Username: marcuspage5715@gmail.com
Password: ????
(2FA goes to 702-334-4017)

Property: https://trweb.co.clark.nv.us/
Parcel ID: 138-30-116-040 (10024 Benjamin Nichols)
Parcel ID: 138-30-215-185 (909 Domnus Ln)

Caesars Rewards number (inactive):
19805641839

Healthcare:
UMR/United Healthcare (Medical)
  (https://www.umr.com/tpa-ap-web/?navDeepDive=publicHomeDefaultContentMenu)
  800-826-9781
  Issuer: 911-39026-02
  Group ID:76-412551
  Member ID: 00000000 (eight digits)

EyeMed (Optical)
  (https://member.eyemedvisioncare.com/member/en/)
  Group ID: Caesars Plan A #9826033
  Member ID: 0000000 (seven digits

OptumRx (Pharmacy)
  (https://www.optumrx.com/public/landing)
  Group ID: 9151014609
  Member ID: 0000000000000 (thirteen digits)

Insurance Company:
Farmers Insurance
Policy Number: ?????????

Previous Vehicles:
2010 Hyundai Elantra
VIN: KMHDU4AD8AU180025`;

const FILE_NAME = "ner.txt";
fs.writeFileSync(FILE_NAME, text);

ner.fromFile(
  `C:\\Users\\derry\\Documents\\GitHub\\DarkWebScraping\\scraper\\${FILE_NAME}`,
  function (entities) {
    console.log(entities);
  }
);
