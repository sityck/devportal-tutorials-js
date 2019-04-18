//import { Client, PrivateKey } from 'dsteem';
//import { Testnet as NetConfig } from '../../configuration'; //A Steem Testnet. Replace 'Testnet' with 'Mainnet' to connect to the main Steem blockchain.

//let opts = { ...NetConfig.net };

//connect to server which is connected to the network/testnet
//const client = new Client(NetConfig.url, opts);

 const dsteem = require('dsteem');
 //define network parameters
 let opts = {};
 opts.addressPrefix = 'TST';
 opts.chainId =
     '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e';
 //connect to a steem node, testnet in this case
 const client = new dsteem.Client('http://127.0.0.1:8091/rpc', opts);

//submit post function
window.submitPost = async () => {
    //get private key
    const privateKey = dsteem.PrivateKey.fromString(
        document.getElementById('postingKey').value
    );
    //get account name
    const account = document.getElementById('username').value;
    //get title
    const title = document.getElementById('title').value;
    //get body
    const body = document.getElementById('body').value;
    //get tags and convert to array list
    const tags = document.getElementById('tags').value;
    const taglist = tags.split(' ');
    //make simple json metadata including only tags
    const json_metadata = JSON.stringify({ tags: taglist });
    //generate random permanent link for post
    const permlink = Math.random()
        .toString(36)
        .substring(2);

    const payload = {
        author: account,
        body: body,
        json_metadata: json_metadata,
        parent_author: '',
        parent_permlink: taglist[0],
        permlink: permlink,
        title: title,
    };
    console.log('client.broadcast.comment:', payload);
    client.broadcast.comment(payload, privateKey).then(
        function(result) {
            console.log('response:', result);
            document.getElementById('title').value = '';
            document.getElementById('body').value = '';
            document.getElementById('tags').value = '';
            document.getElementById('postLink').style.display = 'block';
            document.getElementById(
                'postLink'
            ).innerHTML = `<br/><p>Included in block: ${
                result.block_num
            }</p><br/><br/><a href="http://condenser.steem.vc/${
                taglist[0]
            }/@${account}/${permlink}">Check post here</a>`;
        },
        function(error) {
            console.error(error);
        }
    );
};

