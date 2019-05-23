!function(e){var o={};function i(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.m=e,i.c=o,i.d=function(e,o,t){i.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:t})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,o){if(1&o&&(e=i(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var n in e)i.d(t,n,function(o){return e[o]}.bind(null,n));return t},i.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(o,"a",o),o},i.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},i.p="",i(i.s=1)}([function(e,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0}),o.logger=((e,...o)=>console.log(`[${e}]`,...o))},function(e,o,i){"use strict";(function(e){var t,n=this&&this.__awaiter||function(e,o,i,t){return new(i||(i=Promise))(function(n,r){function s(e){try{l(t.next(e))}catch(e){r(e)}}function c(e){try{l(t.throw(e))}catch(e){r(e)}}function l(e){e.done?n(e.value):new i(function(o){o(e.value)}).then(s,c)}l((t=t.apply(e,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const r=i(3),s=i(4),c=i(5),l=i(6),a=i(13),u=i(0);t=i(15)(e);const d=c.scriptName("underbase").usage("Usage: $0 <command> [OPTIONS]").command("migrate <migration>","Execute migrations").command("list","Show all migrations versions").command("status","Show migrations status").command("unlock","Unlock migrations state").describe("config <path>","JSON configuration file path").describe("db <url>","MongoDB connection URL").describe("migrations-dir <path>","Migrations versions directory").describe("backup","Enable automatic backups").describe("backups-dir <path>","Backups directory").describe("collection-name <name>","Migrations state collection").describe("logs","Enable logs").describe("rerun","Force migrations execution").describe("chdir <path>","Change the working directory").describe("version","Show package version").describe("mongodumpBinary <path>","Binary file for mongodump (it can be a docker exec command)").help("h","Show this help message").alias("h","help").locale("en_US").parse();let g={},f=d.chdir||process.cwd();d.config&&(g=t(s.resolve(s.join(f,d.config)))),g.chdir&&(f=g.chdir);const h={logs:d.logs||g.logs||!0,logger:u.logger,logIfLatest:!0,collectionName:d.collectionName||g.collectionName||"migrations",db:d.db||g.db||null,backup:d.backup||g.backup||!1,backupsDir:s.resolve(s.join(f,d.backupsDir||g.backupsDir||"./migrations/backups")),migrationsDir:s.resolve(s.join(f,d.migrationsDir||g.migrationsDir||"./migrations")),mongodumpBinary:d.mongodumpBinary||g.mongodumpBinary||"mongodump"};function p(){process.exit()}function m(){return n(this,void 0,void 0,function*(){u.logger("info","Connecting to MongoDB..."),yield l.migrator.config(h)})}!function(){n(this,void 0,void 0,function*(){d._[0]||(u.logger("error","Invalid command. Type --help to show available commands."),p()),r.existsSync(h.migrationsDir)||(r.mkdirpSync(h.migrationsDir),u.logger("info","Created migration directory.")),!r.existsSync(h.backupsDir)&&h.backup&&(r.mkdirpSync(h.backupsDir),u.logger("info","Created backup directory."));let e=r.readdirSync(h.migrationsDir).filter(e=>e.match(new RegExp(/^[\d].[\d]$/)));switch(d._[0]){case"migrate":{const o=e.map(e=>parseFloat(e));if(0!==d.migration&&o.indexOf(parseFloat(d.migration))<0&&(u.logger("error","This version does not exists."),p()),e=o.map(e=>e.toFixed(1)),yield m(),e.forEach(e=>n(this,void 0,void 0,function*(){const o=yield t(`${h.migrationsDir}/${e}`).default;yield l.migrator.add(o)})),h.backup){const e=yield l.migrator.getVersion();yield a.create(h.mongodumpBinary,e,h.backupsDir)}const i=(new Date).getTime();d.rerun?yield l.migrator.migrateTo(`${d.migration},rerun`):yield l.migrator.migrateTo(d.migration);const r=((new Date).getTime()-i)/1e3;u.logger("info",`Time spent: ${r} sec`);break}case"list":u.logger("info","Versions list based on folders"),e.forEach(e=>console.log(e));break;case"status":{yield m();const e=yield l.migrator.getVersion(),o=(yield l.migrator.isLocked())?"locked":"not locked";u.logger("info",`Current version is ${e}`),u.logger("info",`Migration state is ${o}`);break}case"unlock":if(yield m(),yield l.migrator.isLocked()){const e=(new Date).getTime();yield l.migrator.unlock(),u.logger("info","Migration state unlocked.");const o=((new Date).getTime()-e)/1e3;u.logger("info",`Time spent: ${o} sec`)}else u.logger("info","Migration state is already unlocked.");break;default:u.logger("error","Invalid command. Type --help to show available commands.")}p()})}()}).call(this,i(2)(e))},function(e,o){e.exports=function(e){return e.webpackPolyfill||(e.deprecate=function(){},e.paths=[],e.children||(e.children=[]),Object.defineProperty(e,"loaded",{enumerable:!0,get:function(){return e.l}}),Object.defineProperty(e,"id",{enumerable:!0,get:function(){return e.i}}),e.webpackPolyfill=1),e}},function(e,o){e.exports=require("fs-extra")},function(e,o){e.exports=require("path")},function(e,o){e.exports=require("yargs")},function(e,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});const t=i(7);o.Migration=t.Migration;const n=new t.Migration;o.migrator=n,process.env.MIGRATE&&n.migrateTo(process.env.MIGRATE)},function(e,o,i){"use strict";var t=this&&this.__awaiter||function(e,o,i,t){return new(i||(i=Promise))(function(n,r){function s(e){try{l(t.next(e))}catch(e){r(e)}}function c(e){try{l(t.throw(e))}catch(e){r(e)}}function l(e){e.done?n(e.value):new i(function(o){o(e.value)}).then(s,c)}l((t=t.apply(e,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const n=i(8),r=i(9),s=i(10),c=i(11),l=i(12),a=c.typeCheck;o.Migration=class{constructor(e){this.defaultMigration={version:0,up:()=>{}},this._list=[this.defaultMigration],this.options=e||{logs:!0,logger:null,logIfLatest:!0,collectionName:"migrations",db:null}}getConfig(){return this.options}getMigrations(){return this._list}isLocked(){return t(this,void 0,void 0,function*(){return null!==(yield this._collection.findOne({_id:"control",locked:!0}))})}config(e){return t(this,void 0,void 0,function*(){if(this.options=Object.assign({},this.options,e),!this.options.logger&&this.options.logs&&(this.options.logger=((e,...o)=>console.log(e,...o))),!1===this.options.logs&&(this.options.logger=((e,...o)=>{})),!(this._db instanceof s.Db||this.options.db))throw new ReferenceError("Option.db canno't be null");let o;o="string"==typeof this.options.db?(yield s.MongoClient.connect(this.options.db,{promiseLibrary:n.Promise,useNewUrlParser:!0})).db():this.options.db,this._collection=o.collection(this.options.collectionName),this._db=o})}add(e){if("function"!=typeof e.up)throw new Error("Migration must supply an up function.");if("function"!=typeof e.down)throw new Error("Migration must supply a down function.");if("number"!=typeof e.version)throw new Error("Migration must supply a version number.");if(e.version<=0)throw new Error("Migration version must be greater than 0");Object.freeze(e),this._list.push(e),this._list=r.sortBy(this._list,e=>e.version)}migrateTo(e){return t(this,void 0,void 0,function*(){if(!this._db)throw new Error("Migration instance has not be configured/initialized. Call <instance>.config(..) to initialize this instance");if(r.isUndefined(e)||""===e||0===this.getMigrations().length)throw new Error("Cannot migrate using invalid command: "+e);let o,i;"number"==typeof e?o=e:(o=e.split(",")[0],i=e.split(",")[1]);try{"latest"===o?yield this.execute(r.last(this.getMigrations()).version):yield this.execute(parseFloat(o),"rerun"===i)}catch(e){throw this.options.logger("info","Encountered an error while migrating. Migration failed."),e}})}getNumberOfMigrations(){return this.getMigrations().length-1}getVersion(){return t(this,void 0,void 0,function*(){return(yield this.getControl()).version})}unlock(){return t(this,void 0,void 0,function*(){yield this._collection.updateOne({_id:"control"},{$set:{locked:!1}})})}reset(){return t(this,void 0,void 0,function*(){this._list=[this.defaultMigration],yield this._collection.deleteMany({})})}execute(e,o){return t(this,void 0,void 0,function*(){const i=this;let n=(yield this.getControl()).version;const r=(e,o)=>t(this,void 0,void 0,function*(){const t=i.getMigrations()[o];if("function"!=typeof t[e])throw yield s(),new Error("Cannot migrate "+e+" on version "+t.version);this.options.logger("info","Running "+e+"() on version "+t.version+(t.name?" ("+t.name+")":"")),yield t[e](new l.MongoInterface(i._db))}),s=()=>i.setControl({locked:!1,version:n}),c=()=>t(this,void 0,void 0,function*(){return yield i.setControl({locked:!0,version:n})});if(!1===(yield(()=>t(this,void 0,void 0,function*(){const e=yield i._collection.findOneAndUpdate({_id:"control",locked:!1},{$set:{locked:!0,lockedAt:new Date}});return null!=e.value&&1===e.ok}))()))return void this.options.logger("info","Not migrating, control is locked.");if(o)return this.options.logger("info","Rerunning version "+e),yield r("up",e),this.options.logger("info","Finished migrating."),void(yield s());if(n===e)return this.options.logIfLatest&&this.options.logger("info","Not migrating, already at version "+e),void(yield s());const a=this.findIndexByVersion(n),u=this.findIndexByVersion(e);if(this.options.logger("info","Migrating from version "+this.getMigrations()[a].version+" -> "+this.getMigrations()[u].version),n<e)for(let e=a;e<u;e++)try{yield r("up",e+1),n=i.getMigrations()[e+1].version,yield c()}catch(o){throw this.options.logger("error",`Encountered an error while migrating from ${e} to ${e+1}`),o}else for(let e=a;e>u;e--)try{yield r("down",e),n=i.getMigrations()[e-1].version,yield c()}catch(o){throw this.options.logger("error",`Encountered an error while migrating from ${e} to ${e-1}`),o}yield s(),this.options.logger("info","Finished migrating.")})}getControl(){return t(this,void 0,void 0,function*(){return(yield this._collection.findOne({_id:"control"}))||(yield this.setControl({version:0,locked:!1}))})}setControl(e){return t(this,void 0,void 0,function*(){a("Number",e.version),a("Boolean",e.locked);const o=yield this._collection.updateOne({_id:"control"},{$set:{version:e.version,locked:e.locked}},{upsert:!0});return o&&o.result.ok?e:null})}findIndexByVersion(e){for(let o=0;o<this.getMigrations().length;o++)if(this.getMigrations()[o].version===e)return o;throw new Error("Can't find migration version "+e)}}},function(e,o){e.exports=require("bluebird")},function(e,o){e.exports=require("lodash")},function(e,o){e.exports=require("mongodb")},function(e,o){e.exports=require("type-check")},function(e,o,i){"use strict";var t=this&&this.__awaiter||function(e,o,i,t){return new(i||(i=Promise))(function(n,r){function s(e){try{l(t.next(e))}catch(e){r(e)}}function c(e){try{l(t.throw(e))}catch(e){r(e)}}function l(e){e.done?n(e.value):new i(function(o){o(e.value)}).then(s,c)}l((t=t.apply(e,o||[])).next())})};Object.defineProperty(o,"__esModule",{value:!0});const n=i(0);o.MongoInterface=class{constructor(e){this._db=e,this._actions=[],this.cursorOptions={cursor:{batchSize:500},allowDiskUse:!0}}MongoClient(){return this._db}collection(e){const o=this;o.collectionName=e,o._collection=o.MongoClient().collection(e);let i={},r={};const s=()=>o.cursor(r||{},e=>{o._collection.updateOne({_id:e._id},i)});return{applySchema:e=>{for(const o in e)for(const t in e[o]){switch(r=e[o][t].$where||{},i[t]={},t){case"$rename":i[t][o]=e[o][t].$value;case"$set":i[t][o]=e[o][t].$value;case"$unset":i[t][o]=1;default:i[t][o]=e[o][t]}s()}},rename:(e,o)=>{const t={};return{where:n=>(r=n||{},t[e]=o,i={$rename:t},s())}},unset:e=>{const o={};return{where:t=>{if("string"==typeof e)o[e]=1;else{if(!Array.isArray(e))throw new Error("Field name in .unset() must of type string or array.");for(const i of e)o[i]=1}return r=t||{},i={$unset:o||{}},s()}}},set:(e,o)=>{const t={};return{where:n=>(t[e]=o,r=n||{},i={$set:t||{}},s())}},destroy:e=>(r=e||{},o.cursor(r,e=>{o._collection.deleteOne({_id:e._id})})),drop:()=>{const i=new Promise((i,r)=>t(this,void 0,void 0,function*(){yield o.MongoClient().dropCollection(e,(e,o)=>i()),n.logger("info","Deleted collection "+e)}));this._actions.push(i)},update:(e,o)=>{},iterate:(e,i)=>(r=e||{},o.cursor(r,i))}}save(){return t(this,void 0,void 0,function*(){try{return Promise.all(this._actions)}catch(e){return new Error(e)}})}cursor(e,o){return t(this,void 0,void 0,function*(){const i=new Promise((i,n)=>t(this,void 0,void 0,function*(){const t=yield this._collection.aggregate([{$match:e||{}}],this.cursorOptions,null);t.on("data",e=>{o(e)}),t.on("close",()=>n("MongoDB closed the connection")),t.on("end",()=>i())}));this._actions.push(i)})}}},function(e,o,i){"use strict";Object.defineProperty(o,"__esModule",{value:!0});const t=i(14),n=i(0);o.create=((e,o,i)=>new Promise((r,s)=>{n.logger("info","Creating backup...");const c=[o.toFixed(1),`${Date.now()}.gz`].join("_"),l=[e,"--host localhost:27017",`--archive=${i}/${c}`,"--gzip --db underbase_test"].join(" ");t.exec(l,(e,o,i)=>(e&&(n.logger("error","An error occured while creating backup... Cancelling."),console.error(e),process.exit()),n.logger("success","Backup created : "+c),r()))}))},function(e,o){e.exports=require("child_process")},function(e,o){e.exports=require("esm")}]);