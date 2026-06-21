const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('KOA Calendar Trip Planner', function() {
  let document;

  before(function() {
    const htmlPath = path.join(__dirname, '../public/index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost:8787/'
    });
    document = dom.window.document;
  });

  it('renders the calendar and editor shell', function() {
    expect(document.getElementById('calendar-grid')).to.not.be.null;
    expect(document.getElementById('timeline')).to.not.be.null;
    expect(document.getElementById('edit-form')).to.not.be.null;
  });

  it('includes the key editing fields', function() {
    ['title', 'kind', 'startDate', 'endDate', 'campground', 'driveMinutes', 'rigFit', 'highlights', 'notes'].forEach(id => {
      expect(document.getElementById(id), `missing ${id}`).to.not.be.null;
    });
  });

  it('has the main actions needed for editing the trip', function() {
    expect(document.getElementById('add-block-btn')).to.not.be.null;
    expect(document.getElementById('reset-btn')).to.not.be.null;
    expect(document.getElementById('export-btn')).to.not.be.null;
    expect(document.getElementById('delete-btn')).to.not.be.null;
    expect(document.getElementById('duplicate-btn')).to.not.be.null;
  });

  it('loads the sample itinerary with KOA stops and fixed Hot Springs dates', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    expect(timelineItems.length).to.be.greaterThan(8);
    expect(document.body.textContent).to.include('Hot Springs fixed stay');
    expect(document.body.textContent).to.include('September 16–18');
    expect(document.body.textContent).to.include('Gettysburg / Battlefield KOA Holiday');
  });

  it('shows stats cards for drive and trip summary', function() {
    const statCards = document.querySelectorAll('.stat-card');
    expect(statCards.length).to.equal(4);
    expect(document.getElementById('stats').textContent).to.include('Average drive leg');
  });
});
