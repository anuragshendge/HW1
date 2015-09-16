var AWS = require('aws-sdk');
var fs = require('fs');

AWS.config.update({
    accessKeyId: '-Enter you Key-',
    secretAccessKey: '-Enter your Key-'
});
AWS.config.update({
    region: 'us-west-2'
});

var ec2 = new AWS.EC2();
var instanceID;
var PublicIP;
var params = {

    ImageId: 'ami-5189a661',
    InstanceType: 't2.micro',
    KeyName: 'Enter your key name',
    MinCount: 1,
    MaxCount: 1,
    SecurityGroupIds: ['sg-9a47c5fe']

};

ec2.runInstances(params, function (err, data) {
    if (err) {
        console.log("Could not create instance", err);
        return;
    } else {

        instanceID = data.Instances[0].InstanceId;


        params = {
            InstanceIds: [instanceID]
        };

        ec2.waitFor('instanceRunning', params, function (err, data1) {

            if (err) console.log(err, err.stack);

            else {
                PublicIP = data1.Reservations[0].Instances[0].PublicIpAddress;
                console.log("Public IP=>", PublicIP);
               
                var inventory = "AWSInstance ansible_ssh_host=" + PublicIP + " ansible_ssh_user=ubuntu ansible_ssh_private_key_file=./keys/anurag_123.key"
                fs.writeFile("inventory", inventory, function (err) {
                    if (err) {
                        return console.log(err);
                    } else console.log("Entry added to the Ansible inventory file");
                });


            }
        });

        console.log("Created instance\n Waiting for the instance to boot up and get ready. . .", instanceID);


    }

});
