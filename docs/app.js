const $=s=>document.querySelector(s),N=["Tender count","Std. dev.","Median","Mean","Skewness"];let D;
const cls=b=>b==="High"?"hi":b==="Medium"?"md":"lo",esc=v=>String(v).replace(/[&<>]/g,"");
const sig=z=>1/(1+Math.exp(-z)),band=s=>s>=D.cutoffs.high?"High":s>=D.cutoffs.medium?"Medium":"Low";
function upd(){const v=[0,1,2,3,4].map(i=>parseFloat($("#i"+i).value));
if(v.some(isNaN)||v.slice(0,4).some(a=>a<=0)){$("#sc").textContent="–";$("#bd").textContent="Check inputs";$("#bd").style.background="var(--mu)";$("#ct").innerHTML="";$("#al").innerHTML="";return}
const c=D.weights.map((w,i)=>w*(v[i]-D.feature_info[D.features[i]].mean)),z=D.bias+D.weights.reduce((a,w,i)=>a+w*v[i],0),s=sig(z),b=band(s),r=D.bands.find(x=>x.band===b);
$("#sc").textContent=s.toFixed(3);$("#bd").textContent=b+" band";$("#bd").style.background=`var(--${cls(b)})`;
$("#ex").textContent=`Risk score from 0 to 1. In the training data, ${r.fraud_pct}% of hospitals in the ${b} band were labelled fraud, against ${(D.base_rate*100).toFixed(1)}% overall.`;
$("#al").innerHTML=b==="High"?'<div class="al" style="background:var(--hi)">FRAUD ALERT: high risk<small>Top 5% of risk scores. Refer this hospital for audit review.</small></div>':b==="Medium"?'<div class="al" style="background:var(--md)">WATCH: medium risk<small>Review if capacity allows.</small></div>':"";
const m=Math.max(1.5,...c.map(Math.abs));$("#ct").innerHTML=c.map((a,i)=>`<div class="ct"><span>${N[i]}</span><div class="tr"><i style="${a>=0?"left:50%":"right:50%"};width:${Math.abs(a)/m*50}%;background:var(${a>=0?"--hi":"--lo"})"></i></div><span>${a>=0?"+":""}${a.toFixed(2)}</span></div>`).join("")}
function batch(t){const L=t.trim().split(/\r?\n/).map(l=>l.split(","));const h=L.shift().map(x=>x.trim().toLowerCase());const k=["id","obs_count","std","median","mean","skew"].map(n=>h.indexOf(n));
if(k.some(i=>i<0)){$("#bo").innerHTML='<p class="sm">Missing columns. Expected: id, obs_count, std, median, mean, skew.</p>';return}
const R=[];let bad=0;L.forEach(l=>{const v=k.map(i=>parseFloat(l[i]));if(v.slice(1,5).some(a=>!(a>0))||isNaN(v[5])){bad++;return}const x=v.slice(1),s=sig(D.bias+D.weights.reduce((a,w,i)=>a+w*x[i],0));R.push([l[k[0]],...x,s,band(s)])});
R.sort((a,b)=>b[6]-a[6]);const H=R.filter(r=>r[7]==="High"),M=R.filter(r=>r[7]==="Medium").length;
$("#bo").innerHTML=`<div class="al" style="background:var(--${H.length?"hi":"lo"})">${H.length} FRAUD ALERT${H.length==1?"":"S"} (high risk), ${M} on watch, out of ${R.length} hospitals scored${bad?`, ${bad} rows skipped`:""}</div>`+tbl(["id","Tenders","Std","Median","Mean","Skew","Score","Band"],R.slice(0,50).map(r=>[esc(r[0]),r[1],r[2],r[3],r[4],r[5],r[6].toFixed(3),`<b class="s ${cls(r[7])}">${r[7]}</b>`]))+'<p class="sm mu">Showing the 50 highest scores.</p>'}
function tbl(h,rows){return`<table><tr>${h.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table>`}
fetch("data.json").then(r=>r.json()).then(d=>{D=d;
$("#kv").innerHTML=`<div><b>${d.oof_auc}</b>honest AUC (out-of-fold)</div><div><b>${(d.base_rate*100).toFixed(1)}%</b>fraud rate overall</div><div><b>${d.bands[0].fraud_pct}%</b>fraud rate in High band</div><div><b>${d.bands[0].pct_of_all_fraud}%</b>of all fraud in top 5% of hospitals</div>`;
$("#bands").innerHTML=tbl(["Band","Hospitals","Fraud cases","Fraud rate","Share of all fraud"],d.bands.map(b=>[`<b class="s ${cls(b.band)}">${esc(b.band)}</b>`,b.hospitals,b.fraud_cases,b.fraud_pct+"%",b.pct_of_all_fraud+"%"]));
const k=Object.keys(d.thesis_vs_honest[0]);$("#cmp").innerHTML=tbl(["Model","Thesis","3 features","5 features"],d.thesis_vs_honest.map(r=>[esc(r[k[0]]),r[k[1]],r[k[2]],r[k[3]]]));
const e=Object.entries(d.shap_rf).sort((a,b)=>b[1]-a[1]),mx=e[0][1];$("#shap").innerHTML=e.map(([n,x])=>`<div class="bar"><span>${esc(n)}</span><div><i style="width:${x/mx*100}%"></i></div><span>${x}</span></div>`).join("");
$("#top").innerHTML=tbl(["id","Tenders","Std","Median","Mean","Skew","Score","Band"],d.top_test.map(r=>[r.id,r.obs_count,r.std,r.median,r.mean,r.skew,r.score,`<b class="s ${cls(r.band)}">${esc(r.band)}</b>`]));
document.querySelectorAll("input[type=number]").forEach(i=>i.oninput=upd);upd();
$("#go").onclick=()=>batch($("#ta").value);$("#f").onchange=e=>{const f=e.target.files[0];if(f)f.text().then(t=>{$("#ta").value=t.split(/\r?\n/).slice(0,3).join("\n")+"\n...";batch(t)})}}).catch(()=>{$("#err").hidden=false});
