const defUser = 'APC';
const defPass = 'APC12345';
var app = new Vue({
    el: '#app',
    data() {

        return {
            devices: []
        }
    },
    methods:
    {
        
        rise() {

            this.devices = this.devices.sort((a, b) => a.id - b.id)

        },
        async updateDevice(dev){
            const url = `https://10.70.100.55/api/getsensordetails.json?id=${sens.id}&columns=id,device,lastvalue,status,name&username=${defUser}&password=${defPass}`

        },
        async updateSensor(sens) {
            //https://10.70.100.55/api/table.json?content=channels&output=json&columns=name,lastvalue_&id=8687&username=APC&password=APC12345
            
            const url = `https://10.70.100.55/api/table.json?content=sensors&columns=lastvalue,status,name&filter_objid=${sens.id}&username=${defUser}&password=${defPass}`
            const data = await fetch(url)
                .then((resp) => resp.json())
                .then(function (data) {
                 //   console.log(data);
                    return data.sensors[0];
                });
            sens.lastvalue = data.lastvalue;
            
            if(sens.status!=data.status_raw)
            {
              //  console.log(sens.status, data.status_raw);
            }
            
            sens.status = data.status_raw;
            
        },
        async init() {
            //  const url =  'https://10.70.100.55/api/getsensordetails.json?id=8680&content=sensors&columns=id,device,lastvalue,status,name&username=Simple&password=Laz12345'
            const url = `https://10.70.100.55/api/table.json?content=devices&columns=group,objid,device,status&username=${defUser}&password=${defPass}`;
            const data = await fetch(url)
                .then((resp) => resp.json())
                .then(function (data) {
                    return data;
                });
            //  console.log(data);
            data.devices.filter(function (device) { return device.group === 'APC' }).forEach(dev => {
                //        console.log(element);
                this.addDevice(dev.objid, dev.group, dev.device, dev.status);
                this.devices = this.devices.sort((a, b) => a.id - b.id)

            });


            this.devices.forEach(d => {
                d.sensors.sort((a, b) => a.id - b.id);
            });

            setInterval(() => {

                this.devices.forEach(d => {
                    d.sensors.forEach(s => {
                        this.updateSensor(s);
                    });
                });
            }, 5000);
        },
        async addDevice(objid, group, device, status) {


            const newDevice =
            {
                id: objid,
                group: group,
                name: device,
                status:status,
                sensors: [],

            }

            const url = `https://10.70.100.55/api/table.json?content=sensors&columns=group,objid,device,lastvalue,status,name&id=${newDevice.id}&username=${defUser}&password=${defPass}`;

            const dataSensors = await fetch(url)
                .then((resp) => resp.json())
                .then(function (data) {
                    return data.sensors;
                });

            dataSensors.forEach(sensor => {

                const newSensor =
                {
                    parentDevice:newDevice,
                    id: sensor.objid,
                    name: sensor.name,
                    status: sensor.status_raw,
                    lastvalue: sensor.lastvalue,
                }

                this.addSensor(newDevice, newSensor);
            });

            this.devices.push(newDevice);
            this.devices.sort((a,b)=>a.id-b.id);


        },
        addSensor(device, sensor) {

            device.sensors.push(sensor);
            device.sensors.sort((a,b)=>a.id-b.id);
        }

    }
})
app.init();

  //const url = 'https://10.70.100.55/api/getsensordetails.json?id=8686&username=Simple&password=Laz12345';
/*   const url =  'https://10.70.100.55/api/table.json?id=8680&content=sensors&columns=device,lastvalue,status,name&username=Simple&password=Laz12345'
let timerId = setInterval(() =>
{

  fetch(url)
  .then((resp) => resp.json())
  .then(function(data) {
      console.log(data);
    console.log(data.sensordata.lastvalue);
  })
  .catch(function(error) {
    console.log(error);
  });
}, 10000);
*/
