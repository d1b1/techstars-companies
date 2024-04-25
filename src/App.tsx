import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import fallbackImage from './assets/no-logo.png';
import fallbackAvatarImage from './assets/missing-avatar.jpeg';
import crunchbaseLogo from './assets/crunchbase.png';
import linkedInLogo from './assets/linkedIn.png';
import twitterLogo from './assets/twitter.png';
import GitHubButton from 'react-github-btn';
import CustomModal from './Modal_ValueProp';

import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  RefinementList,
  HitsPerPage,
  Stats,
  SortBy
} from 'react-instantsearch';

import { Panel } from './Panel';
import type { Hit } from 'instantsearch.js';
import './App.css';

const searchClient = algoliasearch(
  'UD1VE6KV0J',
  '1b3aa8792d6de4c1dde62071448d8a6d'
);

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const transformItems = (items) => {
  return items.map((item) => ({
    ...item,
    label: item.label.replace(/_/g, ' '),
  }));
};

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeTheModal = () => {
    localStorage.setItem('alreadySeenModal', 'yes');
    setIsModalOpen(false);
  };

  try {
    setTimeout(() => {
      const alreadySeenModal = localStorage.getItem('alreadySeenModal') || 'no';
      if (alreadySeenModal === 'no') {
        setIsModalOpen(true);
      }
    }, 1000);
  } catch(err) {
    console.log('Small error')
  }

  return (
    <div>

      <InstantSearch
        searchClient={searchClient}
        indexName="Techstars-Companies"
        future={future}
        routing={true}
      >

        <header className="header">
          <h1 className="header-title">
            Techstars Companies (v2)
            <Stats />
          </h1>
          <button className="btn btn-sm btn-outline-dark avatar-btn" onClick={openModal}>
            <img src="https://stephansmith.solutions/assets/clients/stephan-smith-avatar.png" className="avatar_img" />
            Startup Tools
          </button>
        </header>

        <div className="container-fluid">

          <CustomModal
            isOpen={isModalOpen}
            onRequestClose={() => closeTheModal()}
            content={
              <p>Modal Content</p>
            }
          />

          <Configure hitsPerPage={25} />

          <div className="row">
            <div className="col-3 d-none d-md-block d-lg-block">

              <div className="filter-el">
                <h4>
                  Sort By:
                </h4>
                <SortBy
                  ///defaultRefinement="Techstars-Companies"
                  items={[
                    { value: 'Techstars-Companies', label: 'Youngest to Oldest' },
                    { value: 'Techstars-Companies_by_year_asc', label: 'Oldest to Youngest' }
                  ]}
                />
              </div>

              <div className="filter-el">
                <h4>
                  What vertical or focus?:
                </h4>
                <RefinementList searchable="true" searchablePlaceholder="Enter a vertical..." attribute="industry_vertical" />
              </div>

              <div className="filter-el">
                <h4>
                  What Techstars program?
                </h4>
                <RefinementList searchable="true" searchablePlaceholder="Enter a program name..." attribute="program_names" limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  Which program year?
                </h4>
                <RefinementList attribute="first_session_year" />
              </div>

              <div className="filter-el">
                <h4>
                  Which program city?
                </h4>
                <RefinementList searchable="true" attribute="city" searchablePlaceholder="Enter city..." limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  Which State?
                </h4>
                <RefinementList attribute="state_province" />
              </div>

              <div className="filter-el">
                <h4>
                  Which Company?
                </h4>
                <RefinementList attribute="country" />
              </div>

            </div>
            <div className="col-md-9 p-4">

              <SearchBox placeholder="Enter a company name..." className="searchbox" />

              <Hits hitComponent={Hit} />

              <br />
              <Pagination padding={2} />

            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

type HitProps = {
  hit: Hit;
};

function ImageWithFallback({ src, alt, classname, ...props }) {
  const handleError = (e) => {
    e.target.src = fallbackImage;
  };

  return <img src={src} className={classname} alt={alt} onError={handleError} {...props} />;
}

function AvatarWithFallback({ src, alt, classname, ...props }) {
  const handleError = (e) => {
    e.target.src = fallbackAvatarImage;
  };

  return <img src={src || ''} width="80" className={classname} onError={handleError} {...props} />;
}

const YearsBetween = ({ year }) => {
  const currentYear = new Date().getFullYear();
  const yearsBetween = currentYear - year;

  return <span>{yearsBetween} years</span>;
};

function Hit({ hit }: HitProps) {
  return (
    <article>
      <div className="row">
        <div className="col-10">

          <a href={`https://${hit['website']}`} target="_blank">
            <ImageWithFallback src={hit.logo_url} width="80" className="compLogo" alt={hit.name} />
          </a>

          <h4>
            <Highlight attribute="company_name" hit={hit} />
          </h4>

          <p>
            <Highlight attribute="brief_description" hit={hit} />
            &nbsp;
            {hit['website'] && <a href={`https://${hit['website']}`} target="_blank">https://{hit['website']}</a>}
          </p>

          <p>
            <b>HQ Location:</b> {hit.state_province}, {hit.city},&nbsp;
            <b>Program:</b> {hit['program_names']}&nbsp;

            <div className="m-2">
              {(hit.industry_vertical || []).map((item, index) => (
                <span key={index} className="badge bg-secondary me-1">
                  {item}
                </span>
              ))}

              <span className="badge bg-secondary me-1">
                Since: {hit.first_session_year} (<YearsBetween year={hit.first_session_year} /> ago)
              </span>
            </div>
          </p>

        </div>
        <div className="col-2 text-end">

          {hit['crunchbase_url'] ?
            <a href={`https://${hit['crunchbase_url']}`} target="_blank">
              {/* <img src={crunchbaseLogo} className="crunch" /> */}
              <svg fill="#000000" viewBox="0 0 24 24" className="crunch" role="img" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><title>Crunchbase icon</title><path d="M21.6 0H2.4A2.41 2.41 0 0 0 0 2.4v19.2A2.41 2.41 0 0 0 2.4 24h19.2a2.41 2.41 0 0 0 2.4-2.4V2.4A2.41 2.41 0 0 0 21.6 0zM7.045 14.465A2.11 2.11 0 0 0 9.84 13.42h1.66a3.69 3.69 0 1 1 0-1.75H9.84a2.11 2.11 0 1 0-2.795 2.795zm11.345.845a3.55 3.55 0 0 1-1.06.63 3.68 3.68 0 0 1-3.39-.38v.38h-1.51V5.37h1.5v4.11a3.74 3.74 0 0 1 1.8-.63H16a3.67 3.67 0 0 1 2.39 6.46zm-.223-2.766a2.104 2.104 0 1 1-4.207 0 2.104 2.104 0 0 1 4.207 0z"></path></g></svg>
            </a>
            : null}<br/>
          {hit['linkedin_url'] ?
            <a href={`https://${hit['linkedin_url']}`} target="_blank">
              {/* <img src={linkedInLogo} width="40" className="crunch" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="crunch" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>
            </a>
            : null}<br/>
          {hit['twitter_url'] ?
            <a href={`https://${hit['twitter_url']}`} target="_blank">
              {/* <img src={twitterLogo} className="crunch" width="40" /> */}
              <svg xmlns="http://www.w3.org/2000/svg" className="crunch" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm297.1 84L257.3 234.6 379.4 396H283.8L209 298.1 123.3 396H75.8l111-126.9L69.7 116h98l67.7 89.5L313.6 116h47.5zM323.3 367.6L153.4 142.9H125.1L296.9 367.6h26.3z"/></svg>
            </a>
            : null}

        </div>
      </div>
    </article>
  );
}
