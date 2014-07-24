var colors     = require('colors');
var prog       = require('commander');
var wrap       = require('wordwrap')(80);
var cheerio    = require('cheerio');

var cachedText = require('./cachedText');

prog.version('0.0.6')
  .usage('[options]')
  .option('-e, --edition <n>', 'Choose an edition of the brief (integer)', parseInt)
  .parse(process.argv);

var edition = prog.edition || 0;
var displayColors = ['cyan', 'yellow', 'red', 'white', 'grey'];

// extremely non-robust way to strip links from content
var hrefRe = /<a href=\"(.+)\">/g;
var linkCounter = 1;
var links = [];

function stripLinks (content) {
  var $ = cheerio.load(content);
  $('a').each(function (d, i) {
    var href = $(this).attr('href');
    var counterStr = '[' + linkCounter + ']';
    links.push(counterStr + ' ' + href.underline);
    linkCounter++;
  });

  content = content.replace(hrefRe, '').replace('</a>', '');
  return content;
}

function sectionStr (section) {
  var str = '\n\n';
  str += section.sectionTitle.bold[displayColors[1]];

  var items = section.sectionItems;
  items.forEach(function (item) {
    str += [
      '\n\n',
      item.tout[displayColors[2]],
      ' ',
      stripLinks(item.content)[displayColors[3]],
    ].join('');
  });

  return str;
}

function parseRes (json) {
  var currSections = json.editions[edition].sections;

  var finalStr = [
    '\n',
    cachedText.intro.bold[displayColors[0]],
    sectionStr(currSections.watch),
    sectionStr(currSections.sleep),
    sectionStr(currSections.debate),
    sectionStr(currSections.discoveries),
    '\n\n',
    'Links from this brief:'[displayColors[0]],
    '\n\n',
    links.join('\n'),
    '\n\n',
    cachedText.outro[displayColors[3]],
    '\n\n',
    cachedText.footer[displayColors[4]]
  ].join('');

  console.log(wrap(finalStr));
}

module.exports = parseRes;
