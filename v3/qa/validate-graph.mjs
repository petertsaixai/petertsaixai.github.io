import fs from 'node:fs';
const graph=JSON.parse(fs.readFileSync(new URL('../data/graph.json', import.meta.url),'utf8'));
const ids=new Set(graph.nodes.map(n=>n.id));
const errors=[];
for(const n of graph.nodes){if(!n.id||!n.type||!n.label)errors.push(`invalid node ${JSON.stringify(n)}`);}
for(const e of graph.edges){if(!ids.has(e.from)&&e.from!==graph.identity.id)errors.push(`missing edge source ${e.from}`);if(!ids.has(e.to)&&e.to!==graph.identity.id)errors.push(`missing edge target ${e.to}`);if(!e.relation)errors.push(`missing relation ${JSON.stringify(e)}`);}
if(graph.nodes.some(n=>n.visibility==='internal'&&n.type==='education'&&n.status==='not completed'&&n.id!=='nthu-study')) errors.push('unexpected internal degree-status rule');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`v3 graph valid: ${graph.nodes.length} nodes, ${graph.edges.length} edges`);
