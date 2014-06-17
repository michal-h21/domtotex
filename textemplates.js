
var tplStart		= Textpl.tplStart;
var brackets    = Textpl.brackets;
var tplEnd			= Textpl.tplEnd;
var variables   = Textpl.variables;

var templates = {
  "h1": [
  {
    "selector": "*",
    "template": '\\section{<<content>>}'
  }],
  "i" : [
  {
   "selector": "*",
   "template": "\\textit{<<content>>}"
  }
  ],
  "b": [{
   "selector": "*",
   "template": "\\textbf{<<content>>}"
  }],
  "math": [{
    "selector": "[mode='display']",
    "template": "\\[<<content>>\\]"
  },{
    "selector": "*",
    "template": "$<<content>>$" 
  }],
  "mfrac": [{
   "selector" :"*",
	 "template": "\\frac{<<>first>>}{<<>second>>}"
	}],
	"msqrt": [{
		"selector": "*",
		"template": "\\sqrt{<<content>>}"
	}],
	"msup": [{
		"selector": "*",
		"template": "<<>first>>^<<>second>>"
	}],
	"a": [{
		"template": "<<#link>><<#attr>>href<</attr>><</link>>{<<content>>}",
		"selector": "*",
		"packages": ["hyperref"]
	}],
  "*default": [{
    "selector": "*",
    "template": "<<content>>"
  }
  ]
}	


Textpl.loadTemplates(templates);

Textpl.addTemplate("img").tpl("\\includegraphics{<<#attr>>src<</attr>>}");

Textpl.addTemplate("abbr").tpl("\\htmlacro[<<#attr>>title<</attr>>]{<<content>>}");

Textpl.addTemplate("aside").tpl("\\htmlaside{<<content>>}")

Textpl.addTemplate("blockquote").tpl("\\begin{htmlblockqoute}{<<#attr>>cite<</attr>>}\n<<content>>\n\\end{htmlblockqoute}");

Textpl.addTemplate("dl").tpl("\\begin{description}\n<<content>>\n\\end{description}");

Textpl.addTemplate("dt").tpl("\\item[<<content>>]");

Textpl.addTemplate("ul").tpl("\\begin{itemize}\n<<content>>\n\\end{itemize}")
Textpl.addTemplate("ol").tpl("\\begin{enumerate}\n<<content>>\n\\end{enumerate}")
Textpl.addTemplate("li").tpl("\n\\item <<content>>\n");

Textpl.addTemplate("figure").tpl("\\begin{figure}[htb]\n<<content>>\n\\end{figure}");

Textpl.addTemplate("figcaption").tpl("\\caption{<<content>>}");
Textpl.addTemplate("h2").tpl("\\subsection{<<content>>}");
Textpl.addTemplate("h3").tpl("\\subsubsection{<<content>>}");
Textpl.addTemplate("h4").tpl("\\paragraph{<<content>>}");
Textpl.addTemplate("h5").tpl("\\textbf{<<content>>}\n\n");
Textpl.addTemplate("h6").tpl("\\textbf{<<content>>}\n\n");

Textpl.addTemplate("pre").tpl("\\begin{alltt}\n<<content>>\n\\end{alltt}");
Textpl.addTemplate("code").tpl("\\texttt{<<content>>}");
