var needle = require('needle');
var os = require("os");
var fs = require("fs");

var config = {};
config.token = "-Enter your token-"; 

var headers = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + config.token
};
var dropletID;
var PublicIP;

var client = {
    listRegions: function (onResponse) {
        needle.get("https://api.digitalocean.com/v2/regions", {
            headers: headers
        }, onResponse);
    },
    listImages: function (onResponse) {
        needle.get("https://api.digitalocean.com/v2/images", {
            headers: headers
        }, onResponse);
    },

    createDroplet: function (dropletName, region, imageName, onResponse) {
        var data = {
            "name": dropletName,
                "region": region,
                "size": "512mb",
                "image": imageName,
            // Id to ssh_key already associated with account.
            "ssh_keys": [-Enter Your Key-],
            //"ssh_keys":null,
            "backups": false,
                "ipv6": false,
                "user_data": null,
                "private_networking": null
        };

        console.log("Attempting to create: " + JSON.stringify(data));
        needle.post("https://api.digitalocean.com/v2/droplets", data, {
            headers: headers,
            json: true
        }, onResponse);

    },

    listDroplet: function (dropletID,onResponse) {
        needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {
            headers: headers
        }, onResponse);
    },

    deleteDroplet: function (onResponse) {
        needle.delete("https://api.digitalocean.com/v2/droplets/6902114", null, {
            headers: headers
        }, onResponse);
    },

    listKeys: function (callback) {
        needle.get("https://api.digitalocean.com/v2/account/keys", {
            headers: headers
        }, callback);
    }

};


var name = "anuragDevops7" + os.hostname();
var region = "nyc1"; // Fill one in from #1
var image = "ubuntu-14-04-x32"; // Fill one in from #2
client.createDroplet(name, region, image, function (err, resp, body) {
    //console.log(resp.body);

    // StatusCode 202 - Means server accepted request.
    if (err) {
        return console.log(err);
    }

    dropletID = body['droplet']['id'];
    console.log('\nCreated instance\n Waiting for the instance to boot up and get ready. . .');

    if (!err && resp.statusCode == 202) {
        setTimeout(temp, 65000);
	}
});


function temp(){

	needle.get("https://api.digitalocean.com/v2/droplets/" + dropletID, {
            headers: headers
        }, function(err,data,response){

       		PublicIP = response.droplet.networks.v4[0].ip_address;


       	var inventory = "\nDigitalOceanInstance ansible_ssh_host=" + PublicIP + " ansible_ssh_user=root";
               fs.appendFile("inventory", inventory, function (err) {
                   if (err) {
                       return console.log(err);
                   } else console.log("Entry added to the Inventory file");
              });

        });

   }

/* client.listKeys(function(err,resp){

 	if(err){return console.log(err);}
 	else
 		console.log(resp.body.ssh_keys[0].id);

 });*/
