/**
 * Custom configuration
 * (sails.config.custom)
 *
 * One-off settings specific to your application.
 *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.custom = {

  normalizeDigitsToTwo: function(n) {
		return n < 10 ? '0' + n : n; 
  },

  normalizeDigitsTo3Digits: function(n) {
		if(n < 10)
			return '00' + n;
		if(n < 100)
			return '0' + n;
		
		return n;
  },
  

  /***************************************************************************
  *                                                                          *
  * Any other custom config this Sails app should use during development.    *
  *                                                                          *
  ***************************************************************************/
  // mailgunDomain: 'transactional-mail.example.com',
  // mailgunSecret: 'key-testkeyb183848139913858e8abd9a3',
  // stripeSecret: 'sk_test_Zzd814nldl91104qor5911gjald',
  // …
	
	reset_password_timeout: 1 * 60 * 60 * 1000,
	
	base_url: 'http://localhost:1337',	//	Do not keep / in the end
	
	setting_keys: {
		product_categories: 'product_categories',
		sample: 'sample',
		zones: 'zones',
		branches: 'branches',
		
		tnc: 'tnc',
		contact_us: 'contact_us',
		info: 'info',
		board_members: 'board_members'
	},
	
	roles: 			['admin',	'checker',	'maker'],
	apply_branch_filter: 	{
						admin:		false,
						checker: 	false,
						maker:		false,
	},
	
	upload_files: {
						admin:		true,
						checker: 	false,
						maker:		true,
	},
	
	allow_create_content: {
						admin:		true,
						checker: 	true,
						maker:		true,
	},
	
	allowed_to_approve_decline_uploaded_files: {
						admin:		true,
						checker: 	true,
						maker:		false,
	},
	
	holidayhomes_allowed_to_approve_decline: {
						admin:		true,
						checker: 	true,
						maker:		false,
	},
	
	user_create: 	{
						admin:		true,
						checker: 	false,
						maker:		true,
					},
	
	form_create: 	{
						admin:		true,
						checker: 	false,
						maker:		true,
					},
	
	member_create: 	{
						admin:		false,
						checker: 	false,
						maker:		false,
					},
	
	/********************** FOR MS PATEL *************************/
	
	
	serverKey: 'AAAACymi1oA:APA91bEmVoHKU9BILluPOYNB_E7bq9mIvntor_F9VRm7UAIAv0dtWX0EeGAyvNetCQZcOlAioYoVAjQzVGD902a4frQmzL_mkMiSmgZPyrNJcJhMJASqAWce_6F_yDM27OhAebhJPRFs', //put your server key here
	
	timestampLastFYApril: 0,
	timestampThisFYApril: 0,
	fullYearOfLastFYApril: 0,
	fullYearOfThisFYApril: 0,
	
	jsonResponse: function(errormsg, data) {
		
		let response = new Object();
		
		if(errormsg) {
			response.errormsg = errormsg;
			sails.config.log.addlog(undefined, "ERROR", errormsg);
		}
		
		if(data)
			response.data = data;
		
		return response;
	},
	
	getdumppath: function(purpose, fn) {
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();

		var path = "./" + purpose + "/" + year + "/" + month + "/" + day + "/";
		var mkdirp = require('mkdirp');
    
		mkdirp(path, function (err) {
			fn(err, path);
		});
	},
	
	normalizeDigitsToTwo: function(n) {
		return n < 10 ? '0' + n : n; 
	},
	
	normalizeDigitsTo3Digits: function(n) {
		if(n < 10)
			return '00' + n;
		if(n < 100)
			return '0' + n;
		
		return n;
	},
	
	getReadableDate: function(timestamp, showTime = false, date_separator = '-', time_separator = ':') {
		
		let readable_date = 'NA';
		
		if(_.isNumber(timestamp)) {
			let date = new Date(timestamp);
			readable_date = sails.config.custom.normalizeDigitsToTwo(date.getDate()) + date_separator + sails.config.custom.normalizeDigitsToTwo(date.getMonth()+1) + date_separator + date.getFullYear();
			
			if(showTime) {
				readable_date += ', ' + sails.config.custom.normalizeDigitsToTwo(date.getHours()) + time_separator + sails.config.custom.normalizeDigitsToTwo(date.getMinutes());
			}
		}
		
		return readable_date;
	},
	
	getTimestamp: function(date) {	//	To be used only if date is of format 01-Apr-18 or 20190330
		let timestamp = 0;
		if(date) {
			let date_splits = date.split('-');
			if(date_splits.length === 3) {
				let currentYear = (new Date()).getFullYear();
				let shortYear = Number(date_splits[2]);
				if(shortYear > currentYear - 2000) {	//	which means short year belongs to 20th century
					date_splits[2] = '' + (1900 + shortYear);
				} else {
					date_splits[2] = '' + (2000 + shortYear);
				}
				
				timestamp = (new Date(_.kebabCase(date_splits))).getTime();
			} else if(date.length === 8) {
				timestamp = (new Date(_.kebabCase([date.slice(0,4), date.slice(4,6), date.slice(6)]))).getTime();
			}
		}
		
		return timestamp;
	},
	
	createSettingKeys: async function() {
		let setting_keys = Object.keys(sails.config.custom.setting_keys);
		for(let index = 0; index < setting_keys.length; index++) {
			//	Check if the setting exists or not. If it does not exist, then create.
			let setting = await Setting.findOne({name: setting_keys[index]});
			if(!setting)
				await Setting.create({name: setting_keys[index], value: []});
		}
	},

	updateImportantTimeStamps: function () {
		let date = new Date();
		let currentTimestamp = date.getTime();			

		//	Ensuring that while we are in JAN,FEB,MAR... the FY of previous to previous year gets covered
		if(date.getMonth() < 3)
			date.setYear(date.getFullYear()-1);

		date.setMonth(3);
		date.setDate(1);
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);

		sails.config.custom.timestampThisFYApril = date.getTime();
		sails.config.custom.fullYearOfThisFYApril = date.getFullYear();

		date.setYear(date.getFullYear()-1);
		sails.config.custom.timestampLastFYApril = date.getTime();
		sails.config.custom.fullYearOfLastFYApril = date.getFullYear();
	},

	places:[
		{
		  state: "Andaman and Nicobar Islands",
		  city : ["Port Blair*"]
		},
		{
		  state: "Andhra Pradesh",
		  city : [
			"Adoni",
			"Amalapuram",
			"Anakapalle",
			"Anantapur",
			"Bapatla",
			"Bheemunipatnam",
			"Bhimavaram",
			"Bobbili",
			"Chilakaluripet",
			"Chirala",
			"Chittoor",
			"Dharmavaram",
			"Eluru",
			"Gooty",
			"Gudivada",
			"Gudur",
			"Guntakal",
			"Guntur",
			"Hindupur",
			"Jaggaiahpet",
			"Jammalamadugu",
			"Kadapa",
			"Kadiri",
			"Kakinada",
			"Kandukur",
			"Kavali",
			"Kovvur",
			"Kurnool",
			"Macherla",
			"Machilipatnam",
			"Madanapalle",
			"Mandapeta",
			"Markapur",
			"Nagari",
			"Naidupet",
			"Nandyal",
			"Narasapuram",
			"Narasaraopet",
			"Narsipatnam",
			"Nellore",
			"Nidadavole",
			"Nuzvid",
			"Ongole",
			"Palacole",
			"Palasa Kasibugga",
			"Parvathipuram",
			"Pedana",
			"Peddapuram",
			"Pithapuram",
			"Ponnur",
			"Proddatur",
			"Punganur","Puttur","Rajahmundry","Rajam","Rajampet","Ramachandrapuram","Rayachoti","Rayadurg","Renigunta","Repalle","Salur","Samalkot","Sattenapalle","Srikakulam","Srikalahasti","Srisailam Project (Right Flank Colony) Township","Sullurpeta","Tadepalligudem","Tadpatri","Tanuku","Tenali","Tirupati","Tiruvuru","Tuni","Uravakonda","Venkatagiri","Vijayawada","Vinukonda","Visakhapatnam","Vizianagaram","Yemmiganur","Yerraguntla"]
		},
		{
		  state: "Arunachal Pradesh",
		  city : ["Naharlagun","Pasighat"]
		},
		{
		  state: "Assam",
		  city : ["Barpeta","Bongaigaon City","Dhubri","Dibrugarh","Diphu","Goalpara","Guwahati","Jorhat","Karimganj","Lanka","Lumding","Mangaldoi","Mankachar","Margherita","Mariani","Marigaon","Nagaon","Nalbari","North Lakhimpur","Rangia","Sibsagar","Silapathar","Silchar","Tezpur","Tinsukia"]
		},
		{
		  state: "Bihar",
		  city : ["Araria","Arrah","Arwal","Asarganj","Aurangabad","Bagaha","Barh","Begusarai","Bettiah","Bhabua","Bhagalpur","Buxar","Chhapra","Darbhanga","Dehri-on-Sone","Dumraon","Forbesganj","Gaya","Gopalganj","Hajipur","Jamalpur","Jamui","Jehanabad","Katihar","Kishanganj","Lakhisarai","Lalganj","Madhepura","Madhubani","Maharajganj","Mahnar Bazar","Makhdumpur","Maner","Manihari","Marhaura","Masaurhi","Mirganj","Mokameh","Motihari","Motipur","Munger","Murliganj","Muzaffarpur","Narkatiaganj","Naugachhia","Nawada","Nokha","Patna*","Piro","Purnia","Rafiganj","Rajgir","Ramnagar","Raxaul Bazar","Revelganj","Rosera","Saharsa","Samastipur","Sasaram","Sheikhpura","Sheohar","Sherghati","Silao","Sitamarhi","Siwan","Sonepur","Sugauli","Sultanganj","Supaul","Warisaliganj"]
		},
		{
		  state: "Chandigarh",
		  city : ["Chandigarh*"]
		},
		{
		  state: "Chhattisgarh",
		  city : ["Ambikapur","Bhatapara","Bhilai Nagar","Bilaspur","Chirmiri","Dalli-Rajhara","Dhamtari","Durg","Jagdalpur","Korba","Mahasamund","Manendragarh","Mungeli","Naila Janjgir","Raigarh","Raipur*","Rajnandgaon","Sakti","Tilda Newra"]
		},
		{
		  state: "Dadra and Nagar Haveli",
		  city : ["Silvassa*"]
		},
		{
		  state: "Delhi",
		  city : ["Delhi","New Delhi*"]
		},
		{
		  state: "Goa",
		  city : ["Mapusa","Margao","Marmagao","Panaji*"]
		},
		{
		  state: "Gujarat",
		  city : ["Adalaj","Ahmedabad","Amreli","Anand","Anjar","Ankleshwar","Bharuch","Bhavnagar","Bhuj","Chhapra","Deesa","Dhoraji","Godhra","Jamnagar","Kadi","Kapadvanj","Keshod","Khambhat","Lathi","Limbdi","Lunawada","Mahesana","Mahuva","Manavadar","Mandvi","Mangrol","Mansa","Mahemdabad","Modasa","Morvi","Nadiad","Navsari","Padra","Palanpur","Palitana","Pardi","Patan","Petlad","Porbandar","Radhanpur","Rajkot","Rajpipla","Rajula","Ranavav","Rapar","Salaya","Sanand","Savarkundla","Sidhpur","Sihor","Songadh","Surat","Talaja","Thangadh","Tharad","Umbergaon","Umreth","Una","Unjha","Upleta","Vadnagar","Vadodara","Valsad","Vapi","Vapi","Veraval","Vijapur","Viramgam","Visnagar","Vyara","Wadhwan","Wankaner"]
		},
		{
		  state: "Haryana",
		  city : ["Bahadurgarh","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gohana","Gurgaon","Hansi","Hisar","Jind","Kaithal","Karnal","Ladwa","Mahendragarh","Mandi Dabwali","Narnaul","Narwana","Palwal","Panchkula","Panipat","Pehowa","Pinjore","Rania","Ratia","Rewari","Rohtak","Safidon","Samalkha","Sarsod","Shahbad","Sirsa","Sohna","Sonipat","Taraori","Thanesar","Tohana","Yamunanagar"]
		},
		{
		  state: "Himachal Pradesh",
		  city : ["Mandi","Nahan","Palampur","Shimla*","Solan","Sundarnagar"]
		},
		{
		  state: "Jammu and Kashmir",
		  city : ["Anantnag","Baramula","Jammu","Kathua","Punch","Rajauri","Sopore","Srinagar*","Udhampur"]
		},
		{
		  state: "Jharkhand",
		  city : ["Adityapur","Bokaro Steel City","Chaibasa","Chatra","Chirkunda","Medininagar (Daltonganj)","Deoghar","Dhanbad","Dumka","Giridih","Gumia","Hazaribag","Jamshedpur","Jhumri Tilaiya","Lohardaga","Madhupur","Mihijam","Musabani","Pakaur","Patratu","Phusro","Ramgarh","Ranchi*","Sahibganj","Saunda","Simdega","Tenu dam-cum-Kathhara"]
		},
		{
		  state: "Karnataka",
		  city : ["Adyar","Afzalpur","Arsikere","Athni","Bengaluru","Belagavi","Ballari","Chikkamagaluru","Davanagere","Gokak","Hubli-Dharwad","Karwar","Kolar","Lakshmeshwar","Lingsugur","Maddur","Madhugiri","Madikeri","Magadi","Mahalingapura","Malavalli","Malur","Mandya","Mangaluru","Manvi","Mudalagi","Mudabidri","Muddebihal","Mudhol","Mulbagal","Mundargi","Nanjangud","Nargund","Navalgund","Nelamangala","Pavagada","Piriyapatna","Puttur","Rabkavi Banhatti","Raayachuru","Ranebennuru","Ramanagaram","Ramdurg","Ranibennur","Robertson Pet","Ron","Sadalagi","Sagara","Sakaleshapura","Sindagi","Sanduru","Sankeshwara","Saundatti-Yellamma","Savanur","Sedam","Shahabad","Shahpur","Shiggaon","Shikaripur","Shivamogga","Surapura","Shrirangapattana","Sidlaghatta","Sindhagi","Sindhnur","Sira","Sirsi","Siruguppa","Srinivaspur","Tarikere","Tekkalakote","Terdal","Talikota","Tiptur","Tumkur","Udupi","Vijayapura","Wadi","Yadgir"]
		},
		{
		  state: "Karnatka",
		  city : ["Mysore"]
		},
		{
		  state: "Kerala",
		  city : ["Adoor","Alappuzha","Attingal","Chalakudy","Changanassery","Cherthala","Chittur-Thathamangalam","Guruvayoor","Kanhangad","Kannur","Kasaragod","Kayamkulam","Kochi","Kodungallur","Kollam","Kottayam","Kozhikode","Kunnamkulam","Malappuram","Mattannur","Mavelikkara","Mavoor","Muvattupuzha","Nedumangad","Neyyattinkara","Nilambur","Ottappalam","Palai","Palakkad","Panamattom","Panniyannur","Pappinisseri","Paravoor","Pathanamthitta","Peringathur","Perinthalmanna","Perumbavoor","Ponnani","Punalur","Puthuppally","Koyilandy","Shoranur","Taliparamba","Thiruvalla","Thiruvananthapuram","Thodupuzha","Thrissur","Tirur","Vaikom","Varkala","Vatakara"]
		},
		{
		  state: "Madhya Pradesh",
		  city : ["Alirajpur","Ashok Nagar","Balaghat","Bhopal","Ganjbasoda","Gwalior","Indore","Itarsi","Jabalpur","Lahar","Maharajpur","Mahidpur","Maihar","Malaj Khand","Manasa","Manawar","Mandideep","Mandla","Mandsaur","Mauganj","Mhow Cantonment","Mhowgaon","Morena","Multai","Mundi","Murwara (Katni)","Nagda","Nainpur","Narsinghgarh","Narsinghgarh","Neemuch","Nepanagar","Niwari","Nowgong","Nowrozabad (Khodargama)","Pachore","Pali","Panagar","Pandhurna","Panna","Pasan","Pipariya","Pithampur","Porsa","Prithvipur","Raghogarh-Vijaypur","Rahatgarh","Raisen","Rajgarh","Ratlam","Rau","Rehli","Rewa","Sabalgarh","Sagar","Sanawad","Sarangpur","Sarni","Satna","Sausar","Sehore","Sendhwa","Seoni","Seoni-Malwa","Shahdol","Shajapur","Shamgarh","Sheopur","Shivpuri","Shujalpur","Sidhi","Sihora","Singrauli","Sironj","Sohagpur","Tarana","Tikamgarh","Ujjain","Umaria","Vidisha","Vijaypur","Wara Seoni"]
		},
		{
		  state: "Maharashtra",
		  city : ["Ahmednagar","Akola","Akot","Amalner","Ambejogai","Amravati","Anjangaon","Arvi","Aurangabad","Bhiwandi","Dhule","Kalyan-Dombivali","Ichalkaranji","Kalyan-Dombivali","Karjat","Latur","Loha","Lonar","Lonavla","Mahad","Malegaon","Malkapur","Mangalvedhe","Mangrulpir","Manjlegaon","Manmad","Manwath","Mehkar","Mhaswad","Mira-Bhayandar","Morshi","Mukhed","Mul","Greater Mumbai*","Murtijapur","Nagpur","Nanded-Waghala","Nandgaon","Nandura","Nandurbar","Narkhed","Nashik","Navi Mumbai","Nawapur","Nilanga","Osmanabad","Ozar","Pachora","Paithan","Palghar","Pandharkaoda","Pandharpur","Panvel","Parbhani","Parli","Partur","Pathardi","Pathri","Patur","Pauni","Pen","Phaltan","Pulgaon","Pune","Purna","Pusad","Rahuri","Rajura","Ramtek","Ratnagiri","Raver","Risod","Sailu","Sangamner","Sangli","Sangole","Sasvad","Satana","Satara","Savner","Sawantwadi","Shahade","Shegaon","Shendurjana","Shirdi","Shirpur-Warwade","Shirur","Shrigonda","Shrirampur","Sillod","Sinnar","Solapur","Soyagaon","Talegaon Dabhade","Talode","Tasgaon","Thane","Tirora","Tuljapur","Tumsar","Uchgaon","Udgir","Umarga","Umarkhed","Umred","Uran","Uran Islampur","Vadgaon Kasba","Vaijapur","Vasai-Virar","Vita","Wadgaon Road","Wai","Wani","Wardha","Warora","Warud","Washim","Yavatmal","Yawal","Yevla"]
		},
		{
		  state: "Manipur",
		  city : ["Imphal*","Lilong","Mayang Imphal","Thoubal"]
		},
		{
		  state: "Meghalaya",
		  city : ["Nongstoin","Shillong*","Tura"]
		},
		{
		  state: "Mizoram",
		  city : ["Aizawl","Lunglei","Saiha"]
		},
		{
		  state: "Nagaland",
		  city : ["Dimapur","Kohima*","Mokokchung","Tuensang","Wokha","Zunheboto"]
		},
		{
		  state: "Odisha",
		  city : ["Balangir","Baleshwar Town","Barbil","Bargarh","Baripada Town","Bhadrak","Bhawanipatna","Bhubaneswar*","Brahmapur","Byasanagar","Cuttack","Dhenkanal","Jatani","Jharsuguda","Kendrapara","Kendujhar","Malkangiri","Nabarangapur","Paradip","Parlakhemundi","Pattamundai","Phulabani","Puri","Rairangpur","Rajagangapur","Raurkela","Rayagada","Sambalpur","Soro","Sunabeda","Sundargarh","Talcher","Tarbha","Titlagarh"]
		},
		{
		  state: "Puducherry",
		  city : ["Karaikal","Mahe","Pondicherry*","Yanam"]
		},
		{
		  state: "Punjab",
		  city : ["Amritsar","Barnala","Batala","Bathinda","Dhuri","Faridkot","Fazilka","Firozpur","Firozpur Cantt.","Gobindgarh","Gurdaspur","Hoshiarpur","Jagraon","Jalandhar Cantt.","Jalandhar","Kapurthala","Khanna","Kharar","Kot Kapura","Longowal","Ludhiana","Malerkotla","Malout","Mansa","Moga","Mohali","Morinda, India","Mukerian","Muktsar","Nabha","Nakodar","Nangal","Nawanshahr","Pathankot","Patiala","Pattran","Patti","Phagwara","Phillaur","Qadian","Raikot","Rajpura","Rampura Phul","Rupnagar","Samana","Sangrur","Sirhind Fatehgarh Sahib","Sujanpur","Sunam","Talwara","Tarn Taran","Urmar Tanda","Zira","Zirakpur"]
		},
		{
		  state: "Rajasthan",
		  city : ["Ajmer","Alwar","Bikaner","Bharatpur","Bhilwara","Jaipur*","Jodhpur","Lachhmangarh","Ladnu","Lakheri","Lalsot","Losal","Makrana","Malpura","Mandalgarh","Mandawa","Mangrol","Merta City","Mount Abu","Nadbai","Nagar","Nagaur","Nasirabad","Nathdwara","Neem-Ka-Thana","Nimbahera","Nohar","Nokha","Pali","Phalodi","Phulera","Pilani","Pilibanga","Pindwara","Pipar City","Prantij","Pratapgarh","Raisinghnagar","Rajakhera","Rajaldesar","Rajgarh (Alwar)","Rajgarh (Churu)","Rajsamand","Ramganj Mandi","Ramngarh","Ratangarh","Rawatbhata","Rawatsar","Reengus","Sadri","Sadulshahar","Sadulpur","Sagwara","Sambhar","Sanchore","Sangaria","Sardarshahar","Sawai Madhopur","Shahpura","Shahpura","Sheoganj","Sikar","Sirohi","Sojat","Sri Madhopur","Sujangarh","Sumerpur","Suratgarh","Taranagar","Todabhim","Todaraisingh","Tonk","Udaipur","Udaipurwati","Vijainagar, Ajmer"]
		},
		{
		  state: "Tamil Nadu",
		  city : ["Arakkonam","Aruppukkottai","Chennai*","Coimbatore","Erode","Gobichettipalayam","Kancheepuram","Karur","Lalgudi","Madurai","Manachanallur","Nagapattinam","Nagercoil","Namagiripettai","Namakkal","Nandivaram-Guduvancheri","Nanjikottai","Natham","Nellikuppam","Neyveli (TS)","O' Valley","Oddanchatram","P.N.Patti","Pacode","Padmanabhapuram","Palani","Palladam","Pallapatti","Pallikonda","Panagudi","Panruti","Paramakudi","Parangipettai","Pattukkottai","Perambalur","Peravurani","Periyakulam","Periyasemur","Pernampattu","Pollachi","Polur","Ponneri","Pudukkottai","Pudupattinam","Puliyankudi","Punjaipugalur","Ranipet","Rajapalayam","Ramanathapuram","Rameshwaram","Rasipuram","Salem","Sankarankoil","Sankari","Sathyamangalam","Sattur","Shenkottai","Sholavandan","Sholingur","Sirkali","Sivaganga","Sivagiri","Sivakasi","Srivilliputhur","Surandai","Suriyampalayam","Tenkasi","Thammampatti","Thanjavur","Tharamangalam","Tharangambadi","Theni Allinagaram","Thirumangalam","Thirupuvanam","Thiruthuraipoondi","Thiruvallur","Thiruvarur","Thuraiyur","Tindivanam","Tiruchendur","Tiruchengode","Tiruchirappalli","Tirukalukundram","Tirukkoyilur","Tirunelveli","Tirupathur","Tirupathur","Tiruppur","Tiruttani","Tiruvannamalai","Tiruvethipuram","Tittakudi","Udhagamandalam","Udumalaipettai","Unnamalaikadai","Usilampatti","Uthamapalayam","Uthiramerur","Vadakkuvalliyur","Vadalur","Vadipatti","Valparai","Vandavasi","Vaniyambadi","Vedaranyam","Vellakoil","Vellore","Vikramasingapuram","Viluppuram","Virudhachalam","Virudhunagar","Viswanatham"]
		},
		{
		  state: "Telangana",
		  city : ["Adilabad","Bellampalle","Bhadrachalam","Bhainsa","Bhongir","Bodhan","Farooqnagar","Gadwal","Hyderabad*","Jagtial","Jangaon","Kagaznagar","Kamareddy","Karimnagar","Khammam","Koratla","Kothagudem","Kyathampalle","Mahbubnagar","Mancherial","Mandamarri","Manuguru","Medak","Miryalaguda","Nagarkurnool","Narayanpet","Nirmal","Nizamabad","Palwancha","Ramagundam","Sadasivpet","Sangareddy","Siddipet","Sircilla","Suryapet","Tandur","Vikarabad","Wanaparthy","Warangal","Yellandu"]
		},
		{
		  state: "Tripura",
		  city : ["Agartala*","Belonia","Dharmanagar","Kailasahar","Khowai","Pratapgarh","Udaipur"]
		},
		{
		  state: "Uttar Pradesh",
		  city : ["Achhnera","Agra","Aligarh","Allahabad","Amroha","Azamgarh","Bahraich","Chandausi","Etawah","Firozabad","Fatehpur Sikri","Hapur","Hardoi *","Jhansi","Kalpi","Kanpur","Khair","Laharpur","Lakhimpur","Lal Gopalganj Nindaura","Lalitpur","Lalganj","Lar","Loni","Lucknow*","Mathura","Meerut","Modinagar","Moradabad","Nagina","Najibabad","Nakur","Nanpara","Naraura","Naugawan Sadat","Nautanwa","Nawabganj","Nehtaur","Niwai","Noida","Noorpur","Obra","Orai","Padrauna","Palia Kalan","Parasi","Phulpur","Pihani","Pilibhit","Pilkhuwa","Powayan","Pukhrayan","Puranpur","Purquazi","Purwa","Rae Bareli","Rampur","Rampur Maniharan","Rampur Maniharan","Rasra","Rath","Renukoot","Reoti","Robertsganj","Rudauli","Rudrapur","Sadabad","Safipur","Saharanpur","Sahaspur","Sahaswan","Sahawar","Sahjanwa","Saidpur","Sambhal","Samdhan","Samthar","Sandi","Sandila","Sardhana","Seohara","Shahabad, Hardoi","Shahabad, Rampur","Shahganj","Shahjahanpur","Shamli","Shamsabad, Agra","Shamsabad, Farrukhabad","Sherkot","Shikarpur, Bulandshahr","Shikohabad","Shishgarh","Siana","Sikanderpur","Sikandra Rao","Sikandrabad","Sirsaganj","Sirsi","Sitapur","Soron","Suar","Sultanpur","Sumerpur","Tanda","Thakurdwara","Thana Bhawan","Tilhar","Tirwaganj","Tulsipur","Tundla","Ujhani","Unnao","Utraula","Varanasi","Vrindavan","Warhapur","Zaidpur","Zamania"]
		},
		{
		  state: "Uttarakhand",
		  city : ["Bageshwar","Dehradun","Haldwani-cum-Kathgodam","Hardwar","Kashipur","Manglaur","Mussoorie","Nagla","Nainital","Pauri","Pithoragarh","Ramnagar","Rishikesh","Roorkee","Rudrapur","Sitarganj","Srinagar","Tehri"]
		},
		{
		  state: "West Bengal",
		  city : ["Adra","Alipurduar","Arambagh","Asansol","Baharampur","Balurghat","Bankura","Darjiling","English Bazar","Gangarampur","Habra","Hugli-Chinsurah","Jalpaiguri","Jhargram","Kalimpong","Kharagpur","Kolkata","Mainaguri","Malda","Mathabhanga","Medinipur","Memari","Monoharpur","Murshidabad","Nabadwip","Naihati","Panchla","Pandua","Paschim Punropara","Purulia","Raghunathpur","Raghunathganj","Raiganj","Rampurhat","Ranaghat","Sainthia","Santipur","Siliguri","Sonamukhi","Srirampore","Suri","Taki","Tamluk","Tarakeswar"]
		}
	  ]
	  
};
