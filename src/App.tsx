import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import fallbackImage from './assets/no-logo.png';
import fallbackAvatarImage from './assets/missing-avatar.jpeg';
import crunchbaseLogo from './assets/crunchbase.png';
import linkedInLogo from './assets/linkedIn.png';
import twitterLogo from './assets/twitter.png';
import GitHubButton from 'react-github-btn';
import CustomModal from './Modal2';

import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  RefinementList,
  HitsPerPage,
  Stats
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

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

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
        <div className="gh-btn">
          
          <GitHubButton href="https://github.com/d1b1/techstars-companies" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" data-show-count="true" aria-label="Star d1b1/techstar-companies on GitHub">Star</GitHubButton>
        </div>
      </header>

      <div className="container-fluid">

        <CustomModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          content={<p>Modal Content</p>}
        />
        
        <Configure hitsPerPage={25} />

          <div className="row">
            <div className="col-3 d-none d-md-block d-lg-block">

            <div className="filter-el">
                <h4>
                  Industry:
                </h4>
                <RefinementList searchable="true" searchablePlaceholder="Enter a vertical..." attribute="industry_vertical" />
              </div>

              <div className="filter-el">
                <h4>
                  Industry:
                </h4>
                <RefinementList searchable="true" searchablePlaceholder="Enter a vertical..." attribute="program_names" limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  Program Year:
                </h4>
                <RefinementList attribute="first_session_year" />
              </div>

              <div className="filter-el">
                <h4>
                  Program City:
                </h4>
                <RefinementList searchable="true" attribute="city" searchablePlaceholder="Enter city..." limit="5" />
              </div>

              <div className="filter-el">
                <h4>
                  State/Province:
                </h4>
                <RefinementList attribute="state_province" />
              </div>

              <div className="filter-el">
                <h4>
                  Country:
                </h4>
                <RefinementList attribute="country" />
              </div>
              
            </div>
            <div className="col-md-9 p-4">

              <SearchBox placeholder="Enter a company name..." className="searchbox" />

              <Hits hitComponent={Hit}/>

              <br/>
              <Pagination padding={2}/>
 
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
            { hit['website'] && <a href={`https://${hit['website']}`} target="_blank">https://{hit['website']}</a>}
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
                <img src={crunchbaseLogo} className="crunch" />
              </a>
              : null}
            {hit['linkedin_url'] ?
              <a href={`https://${hit['linkedin_url']}`} target="_blank">
                <img src={linkedInLogo} width="40" className="crunch" />
              </a>
              : null}
            {hit['twitter_url'] ?
              <a href={`https://${hit['twitter_url']}`} target="_blank">
                <img src={twitterLogo} className="crunch" width="40" />
              </a>
              : null}
              
        </div>
      </div>
    </article>
  );
}
