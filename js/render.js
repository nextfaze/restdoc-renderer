
function render(fname, divname) {
	$.ajax({
		url : fname,
		success : function (data) {
			var html = '';
			
			html += createHeaderSection(data.headers);
			html += createResourceSection(data.resources);

			document.getElementById(divname).innerHTML = html;
		},
		error : function () {
			document.getElementById(divname).innerHTML = 'Error loading RestDoc';
		},
		dataType : 'json'
	});
}

function createHeaderSection(headers) {
	var html = '<div class="restdoc-headers" id="headers">\n';
	html += '<h2>Global headers</h2>\n';
	html += createHeaderList('h3', 'Request', headers.request);
	html += createHeaderList('h3', 'Response', headers.response);	
	html += '</div>';
	return html;
}

function createHeaderList(st, title, headers) {
	var html = '<'+st+'>' + title + '</'+st+'>\n';
	html += '<ul>';
	for (var prop in headers) {
		if (headers[prop].required && headers[prop].required === true) {
			var req = '';
		} else {
			var req = ' <small><em>(optional)</em></small>';
		}
		html += listItem(prop, headers[prop].description + req);	
	}
	html += '</ul>\n';
	return html;
}

function createResourceSection(data) {
	var html = '<h2>Resources</h2><div class="accordion" id="accordion-res">';
	
	for (var i = 0; i < data.length; i++) {
		html += createResource(data[i]);
	}
	html += '</div>';
	return html;
}

function createResource(res) {
	var desc = res.description ? res.description : 'No description';
	
	var html = '<div class="accordion-group">';
	html += '<div class="accordion-heading">';
	html += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-res" href="#collapse' + res.id + '">';
	html += '<h3>' + res.path + ': ' + desc + ' <i class="icon-resize-vertical icon-4x"></i></h3></a></div>\n';
	
	html += '<div id="collapse' + res.id + '" class="accordion-body collapse"><div class="accordion-inner">';
	
	html += '<h4>Identifier</h4>';
	html += '<p>' + res.id + '</p>';
	
	html += '<h4>Parameters</h4>';
	html += createParamSection(res.params);
	
	html += '<h4>Methods</h4><div class="accordion" id="accordion-'+res.id+'-method">';
	for (var prop in res.methods) {
		html += createMethodSection(res.id, prop, res.methods[prop]);
	}
	html += '</div>'; // Method accordion
	
	html += '</div></div></div>';
	return html;
}

function createParamSection(params) {
	var html = '<div class="restdoc-params well well-small">\n';
	html += '<ul>';
	for (var prop in params) {
		var req = '';
		if (params[prop].validations) {
			for (var i = 0; i < params[prop].validations.length; i++) {
				if (params[prop].validations[i].type === 'match') {
					req = ' (<code>' + params[prop].validations[i].pattern + '</code>)';		
				}
			}
		}
		html += listItem(prop, params[prop].description + req);
	}
	html += '</ul></div>\n';
	return html;
}

function createMethodSection(res, name, method) {
	var desc = (method.description) ? method.description : 'No description';

	var html = '<div class="accordion-group">';
	html += '<div class="accordion-heading">';
	html += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion-'+res.id+'-method" href="#collapseMethod' + res+'-'+name + '">';
	html += '<p><span class="label label-info">' + name + '</span> ' + desc + ' <i class="icon-resize-vertical icon-large"></i></p></a></div>\n';
	
	html += '<div id="collapseMethod' + res+'-'+name + '" class="accordion-body collapse"><div class="accordion-inner">';
	if (method.headers) {
		html += createHeaderList('h5', 'Headers', method.headers);	
	}
	if (method.accepts) {
		html += createAccept('Accepts', method.accepts);
	}
	if (method.statusCodes) {
		html += createStatusCodes(method.statusCodes);
	}
	if (method.response && method.response.headers) {
		html += createHeaderList('h5', 'Response headers', method.response.headers);	
	}
	if (method.response && method.response.types) {
		html += createAccept('Response types', method.response.types);
	}
	if (method.examples) {
		html += createExamples('Examples', method.examples);
	}
	html += '</div></div></div>';
	return html;
}

function createExamples(title, examples) {
	var html = '<h5>'+title+'</h5>\n';
	for (var i = 0; i < examples.length; i++) {
	 	var eg = examples[i];
	 	html += '<div class="well well-small">\n';
		html += '<h6>'+eg.path+'</h6>';
		
		if (eg.headers) {
			html += '<div>Headers<ul>\n';
			for (var head in eg.headers) { 
				html += listItem(head, eg.headers[head]);
			}
			html += '</ul></div>';
		}

		html += '<div><code>' + eg.body + '</code></div>';
		html += '\n</div>';
	}
	html += '';
	return html;
}


function createAccept(title, accepts) {
	var html = '<h5>'+title+'</h5><ul>\n';
	for (var i = 0; i < accepts.length; i++) {
		var acc = accepts[i];
		var schema = (acc.schema) ? 'Schema: ' + acc.schema : '';
		html += listItem(acc.type, schema);
	}
	html += '</ul>';
	return html;
}

function createStatusCodes(codes) {
	var html = '<h5>Return codes</h5><ul>\n';
	for (var code in codes) { 
		html += listItem(code, codes[code]);
	}
	html += '</ul>';
	return html;
}

function listItem(title, text) {
	var html = '<li><code>' + title + '</code>';
	if (text) {
		html += ' ' + text;
	}
	html += '</li>\n';
	return html;
}