import base64
import requests

vim_url = 'https://pastacolsugo.github.io/vim-b64.html'
vim_url_parts = [
	'https://pastacolsugo.github.io/vim-b64-1.html',
	'https://pastacolsugo.github.io/vim-b64-2.html'
]

def parse_achecker(raw):
	entities = {
		'&lt;':'<',
		'&gt;':'>',
		'&amp;':'&',
		'&quot;':'"',
	}

	out = ''

	raw = raw.split('<ol class="source">')[-1].split('</ol>')[0]
	raw = raw.replace('</li>', '')

	for l in raw.split('\n'):
		if l == '':
			continue
		out += l.split('>')[-1] + '\n'

	for (k, v) in entities.items():
		out = out.replace(k, v)

	return out[:-2]

def parse_validator(raw):
	entities = {
		'&lt;':'<',
		'&gt;':'>',
		'&amp;':'&',
		'&quot;':'"',
	}

	out = ''

	raw = raw.split('<ol class="source">')[-1].split('</ol>')[0]
	raw = raw.replace('<code class="lf" title="Line break">↩</code>', '\n')
	lines = raw.split('</li>')

	for l in lines:
		res = ''
		blocks = l.split('>')
		for b in blocks:
			if len(b) == 0:
				continue
			if b[0] != '<':
				res += b.split('<')[0]
		out += res

	for (k, v) in entities.items():
		out = out.replace(k, v)

	return out

def request_achecker(url):
	headers = {
	    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	    'Accept-Language': 'en-US,en;q=0.9,it-IT;q=0.8,it;q=0.7',
	    'Cache-Control': 'no-cache',
	    'Connection': 'keep-alive',
	    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary7n1AcKKn3XJHcyCa',
	    'DNT': '1',
	    'Origin': 'null',
	    'Pragma': 'no-cache',
	    'Upgrade-Insecure-Requests': '1',
	    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
	    'sec-gpc': '1',
	}	

	data = f'------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="uri"\r\n\r\n{url}\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="validate_uri"\r\n\r\nCheck It\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="MAX_FILE_SIZE"\r\n\r\n52428800\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="uploadfile"; filename=""\r\nContent-Type: application/octet-stream\r\n\r\n\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="pastehtml"\r\n\r\n------WebKitFormBoundarycSYAqAzAu2behcHi\r\nContent-Disposition: form-data; name="show_source"\r\n\r\n1\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="show_source"\r\n\r\n1\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="radio_gid[]"\r\n\r\n8\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="checkbox_gid[]"\r\n\r\n8\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa\r\nContent-Disposition: form-data; name="rpt_format"\r\n\r\n1\r\n------WebKitFormBoundary7n1AcKKn3XJHcyCa--\r\n' 

	print(f'Get cookie')
	init = requests.get('http://achecker.csr.unibo.it/checker/index.php')
	cookies = init.cookies.get_dict()

	print(f'Requesting page')
	response = requests.post('http://achecker.csr.unibo.it/checker/index.php', cookies=cookies, headers=headers, data=data, verify=False)

	print(f'')
	if response.status_code != 200:
		print(f'Error: status {response.status_code}')
		exit(0)

	return parse_achecker(response.text)

def request_validator(url):
	headers = {
	    'authority': 'validator.w3.org',
	    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
	    'accept-language': 'en-US,en;q=0.9,it-IT;q=0.8,it;q=0.7',
	    'cache-control': 'no-cache',
	    'dnt': '1',
	    'pragma': 'no-cache',
	    'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
	    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
	}

	params = {
	    'showsource': 'yes',
	    'doc': f'{url}',
	}

	response = requests.get('https://validator.w3.org/nu/', params=params, headers=headers)

	if response.status_code != 200:
		print(f'Errore: status {response.status_code}')
		exit(0)

	return parse_validator(response.text)

def file_to_b64_html(filename):
	def outname(fn):
		return '.'.join(fn.split('.')[:-1]) + '.b64.html'

	print(f'{filename} => {outname(filename)}')
	file = None

	with open(filename, 'rb') as f:
		file = f.read()

	b64 = base64.b64encode(file).decode()
	b64_html = '<!DOCTYPE html><html name="filename">' + b64

	with open(outname(filename), 'w') as out:
		out.write(b64_html)

def file_b64_html_to_file(filename):
	with open(filename, 'r') as f:
		b64_html = f.read()
	b64_html_to_file(b64_html)

def b64_html_to_file(b64_html):
	print(b64_html)
	filename = b64_html.split('>')[1].split('"')[1]
	print(f'filename={filename}')
	b64 = b64_html.split('>')[-1]
	res = base64.b64decode(b64.encode())
	with open(filename, 'wb') as out:
		out.write(res)

def get_vim(bypass='achecker'):
	if bypass == 'validator':
		vim_b64 = request_validator(vim_url)

	if bypass == 'achecker':
		vim_b64_p1 = request_achecker(vim_url_parts[0])
		vim_b64_p2 = request_achecker(vim_url_parts[1])
		vim_b64 = vim_b64_p1 + vim_b64_p2[21:]

	b64_html_to_file(vim_b64)

if __name__ == "__main__":
	get_vim()