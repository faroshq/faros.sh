#!/usr/bin/env python3
"""Validate rendered documentation links, navigation, metadata, and search coverage."""
import json,sys
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
root=Path(sys.argv[1] if len(sys.argv)>1 else 'public')
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.assets=[];self.ids=set();self.headings=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if a.get('id'):self.ids.add(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag=='h1':self.headings+=1
  if tag in ['script','img'] and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('rel')=='stylesheet':self.assets.append(a['href'])
pages={p:Page(p.read_text()) for p in root.rglob('*.html')}
errors=[];checked=0
for path,page in pages.items():
 is_doc=path.is_relative_to(root/'docs')
 if is_doc and page.headings!=1:errors.append(f'{path}: expected one h1, found {page.headings}')
 for href in page.links + (page.assets if is_doc else []):
  url=urlsplit(href)
  if url.scheme or url.netloc:continue
  if not is_doc and not url.path.startswith('/docs/'):continue
  target=(root/url.path.lstrip('/')) if url.path.startswith('/') else path.parent/url.path
  if not url.path:target=path
  if target.is_dir() or url.path.endswith('/'):target=target/'index.html'
  target=Path(unquote(str(target)))
  checked+=1
  if not target.exists():errors.append(f'{path.relative_to(root)} -> missing {href}')
  elif url.fragment and target.suffix=='.html' and unquote(url.fragment) not in pages.get(target,Page(target.read_text())).ids:
   errors.append(f'{path.relative_to(root)} -> missing anchor {href}')
index=json.loads((root/'docs/index.json').read_text())
urls=[x['url'] for x in index]
if len(urls)!=len(set(urls)):errors.append('Search index contains duplicate URLs')
for doc in index:
 if not all(doc.get(k) for k in ['title','description','type','providerTitle']):errors.append(f'Missing search metadata: {doc["url"]}')
 if not (root/doc['url'].lstrip('/')/'index.html').exists():errors.append(f'Unresolvable search entry: {doc["url"]}')
nav=json.loads(Path('data/docs.json').read_text())
for item in nav['primary']+nav['secondary']:
 if f'/docs/{item["slug"]}/' not in urls:errors.append(f'Missing section: {item["slug"]}')
for provider in nav['providers']:
 for suffix in ['', 'quickstart/', 'reference/', 'troubleshooting/']:
  expected=f'/docs/use/{provider["slug"]}/{suffix}'
  if expected not in urls:errors.append(f'Missing provider page: {expected}')
for p in (root/'docs').rglob('index.html'):
 url='/'+str(p.parent.relative_to(root))+'/'
 if url!='/docs/search/' and url not in urls:errors.append(f'Page missing from search: {url}')
if errors:
 print('\n'.join(sorted(set(errors))));sys.exit(1)
print(f'PASS: {len(index)} search entries, {checked} internal links/anchors, 9 sections, 7 provider areas.')
