'use strict'
const env = require('./lib/env'),
  fs = require('fs'),
  BufferReader = require('./lib/buffer-reader'),
  {calculateId, getFileName} = require('./lib/util'),
  unzip = require('unzip'),
  debug = require('debug')('crx-parser'),
  combine = require('combine-streams');
const path = require('path');

const argv = require('minimist')(process.argv.slice(2));

const parseFromPath = function(path){
  console.log('parsing CRX file at ' + path);
  let waitingFn=null;
  let err = null;
  let rawReader = new BufferReader();
  var crx = {_locales:{},icons:{}};
  let pipeToNext = false;
  let combineStream = combine();

  function checkLength(len, cb){
    if (rawReader.length >= rawReader.pos + len)
      return true;
    waitingFn=cb;
    return false;
  }

  function next(){
    if (waitingFn){
      let callFn = waitingFn;
      waitingFn = null;
      callFn();
    }
  }

  function createIconDir(){
    if(iconDir){
      if (crx.header.id) iconDir = iconDir.replace(APPID, crx.header.id);
      try{
        shell.mkdir('-p', iconDir)
      }catch(e){}
    }
  }

  function parseVersion2(){
    if(!checkLength(8, parseVersion2))
      return;
    let publicKeyLength = rawReader.readUInt32LE();
    let signatureLength = rawReader.readUInt32LE();
    if (publicKeyLength > env.MaxPublicKeySize
        || signatureLength > env. MaxSignatureSize)
        return exit(new Error('Exceed max length: publickey or signature'));
    function parseKeys(){
      
      if(!checkLength(publicKeyLength + signatureLength, parseKeys))
        return;
      crx.header = {
        publicKey: rawReader.readBuffer(publicKeyLength),
        signature: rawReader.readBuffer(signatureLength)
      }
      crx.header.id = calculateId(crx.header.publicKey);
      console.log();
      console.log("== CRX2 ==");
      console.log("pub key: " + crx.header.publicKey.toString('hex'));
      console.log();
      console.log("id: " + crx.header.id);
    }
    parseKeys();
  }

  function parseAsymmetricKey(type, signBuff){
    debug(type, ':', signBuff.length);
    let signReader = new BufferReader(signBuff);
    if(!crx.header[type]) crx.header[type] =[];
    let sign = {};
    let loop = true
    while( signReader.pos < signReader.length && loop){
      let tag =signReader.readVarint32();
      debug('signature:', tag);
      switch (tag){
        case env.Tags.SignTags.PublicKeyTag:
          sign.Publickey = signReader.readBuffer(signReader.readVarint32());
          if(!crx.header.id) {
            crx.header.id = calculateId(sign.Publickey);
          }
          console.log();
          console.log("pub key: " + sign.Publickey.toString('hex'));
          console.log("dynamically generated id: " + calculateId(sign.Publickey));
        break;
        case env.Tags.SignTags.SignatureKeyTag:
          sign.signature = signReader.readBuffer(signReader.readVarint32());
        break;
        default:
          loop = false;
      }
    }
    return crx.header[type].push(sign);
  }

  function parseVersion3(){
    let headerLength=0;
    let headerBuffer=null;
    function getHeaderLength(){
      if (!checkLength(4, getHeaderLength))
        return;
      headerLength = rawReader.readUInt32LE();
      getHeaderBuffer();
    }
    getHeaderLength();
    if (headerLength > env.MaxHeaderSize)
      return exit(new Error('Exceed max length: header'));

    function getHeaderBuffer(){
      if (!checkLength(headerLength, getHeaderBuffer))
        return;
      headerBuffer = rawReader.readBuffer(headerLength);
      parseHeader();
    }

    function parseHeader(){
      console.log();
      console.log("== CRX3 ==");
      
      let headerReader = new BufferReader(headerBuffer);
      crx.header = {};
      debug(`header length:${headerLength}`);
      let loop=true;
      while(headerReader.pos < headerReader.length && loop){
        let tag = headerReader.readVarint32();
        debug('header tag:', tag);
        switch (tag){ //tag for rsa/ecsa
          case env.Tags.AsymmetricKeyTags.sha256_with_rsa:
            parseAsymmetricKey('sha256_with_rsa',
              headerReader.readBuffer(headerReader.readVarint32())
          );
          break;
          case env.Tags.AsymmetricKeyTags.sha256_with_ecdsa:
            parseAsymmetricKey('sha256_with_ecdsa',
            headerReader.readBuffer(headerReader.readVarint32())
          );
          break;
          case env.Tags.SignDataTag:
            {
              let crxIdReader = new BufferReader(headerReader.readBuffer(headerReader.readVarint32()));
              if(crxIdReader.readVarint32() == env.Tags.CrxIdTag)
                crx.header.crx_id = crxIdReader.readBuffer(crxIdReader.readVarint32());
            }
          break;
          default:
            loop=false;
        }
      }
    }
  }



  function magicAndVersion(){
    if(!checkLength(8, magicAndVersion))
      return;
    switch(rawReader.readBuffer(4).toString('ascii')){
      case env.MagicNums.Diff:
        crx.diff = true;
      case env.MagicNums.Normal:
      break;
      default:
        return exit(new Error("Unexpected CRX magic number"));
    }
    switch(crx.version=rawReader.readUInt32LE()){
      case 2:
      case 3:
        break;
      default:
        return exit(new Error('Unexpected CRX version'));
    }
    if (argv.useIncorrect) {
      brokenParser();
    }
    if(crx.version == 2 || crx.diff)
      parseVersion2();
    else
      parseVersion3();
  }

  function exit(error){
    if (error) err = error;
  }


  /**
   * Do NOT use this in production
   * This is the INCORRECT parsing of CRX files by Chromedriver
   */
  function brokenParser(){
    // Purpose ignore error

    // if(!checkLength(8, parseVersion2))
    //   return;
    let publicKeyLength = rawReader.readUInt32LE();
    let signatureLength = rawReader.readUInt32LE();

    // Purposely ignore error
  
    // if (publicKeyLength > env.MaxPublicKeySize
    //     || signatureLength > env. MaxSignatureSize)
    //     return exit(new Error('Exceed max length: publickey or signature'));
    function parseKeys(){
      
      // Purposely ignore error

      // if(!checkLength(publicKeyLength + signatureLength, parseKeys))
      //   return;
      crx.header = {
        publicKey: rawReader.readBuffer(publicKeyLength),
        signature: rawReader.readBuffer(signatureLength)
      }
      crx.header.id = calculateId(crx.header.publicKey);
      console.log();
      console.log("== INCORRECT CRX PARSER ==");
      console.log("pub key: " + crx.header.publicKey.toString('hex'));
      console.log();
      console.log("id: " + crx.header.id);
    }
    parseKeys();
  }

  fs.createReadStream(path)
    .on('error', error=>err = error)
    .on('end',()=>{
      debug('crx file onEnd');
      combineStream.append(null);
    })
    .on('close',()=>{
      debug('crx file onClose')
    })
    .on('data', chunk=>{
      debug('pipeTo', pipeToNext? 'unzip':'raw')
      if(pipeToNext){
        combineStream.append(chunk);
      }else{
        rawReader.appendBuff(chunk);
        next();
      }
    });
  magicAndVersion();
};

const crxPath = path.resolve(__dirname, `../${argv.file}.crx`)
parseFromPath(crxPath);