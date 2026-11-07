/* =========================================================
   HUG YOUR HEAD FOUNDATION — script.js
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------------
     0. COPYRIGHT YEAR
  ------------------------------------------------------- */
  document.querySelectorAll('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* -------------------------------------------------------
     1. MOBILE HAMBURGER OVERLAY NAV
  ------------------------------------------------------- */
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav__overlay');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      overlay.classList.toggle('open');
      document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });

    // Close on any overlay link click
    overlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        hamburger.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* -------------------------------------------------------
     2. INTERSECTION OBSERVER — FADE IN ANIMATIONS
  ------------------------------------------------------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => observer.observe(el));
  }

  /* -------------------------------------------------------
     3. FAQ ACCORDION (tbi.html)
  ------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });

  /* -------------------------------------------------------
     4. FORMSPREE SUCCESS HANDLER
  ------------------------------------------------------- */
  document.querySelectorAll('form[data-formspree]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const successEl = form.nextElementSibling;
      const originalText = submitBtn ? submitBtn.textContent : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      try {
        const data = new FormData(form);
        const res  = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (res.ok) {
          form.style.display = 'none';
          if (successEl && successEl.classList.contains('form-success')) {
            successEl.classList.add('show');
          }
        } else {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
          alert('Oops! Something went wrong. Please try again or email us directly at HugYourHead@Gmail.com');
        }
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
        alert('Network error. Please try again or email HugYourHead@Gmail.com');
      }
    });
  });

  /* -------------------------------------------------------
     5. BACK TO TOP BUTTON
  ------------------------------------------------------- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------------
     6. DONATION AMOUNT SELECTOR (get-involved.html)
  ------------------------------------------------------- */
  const donationAmounts = document.querySelectorAll('.donation-amount');
  donationAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
      donationAmounts.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* -------------------------------------------------------
     7. ACTIVE NAV LINK HIGHLIGHT
  ------------------------------------------------------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* -------------------------------------------------------
     8. SMOOTH SCROLL FOR ANCHOR LINKS
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* -------------------------------------------------------
     9. FINANCIAL LITERACY SIGN-UP FORM (financial-literacy-signup.html)
        Runs only when #fl-signup-form is on the page.
        This form does NOT use data-formspree (section 4),
        so it is submitted exactly once, by the code below.
  ------------------------------------------------------- */
  const flForm = document.getElementById('fl-signup-form');
  if (flForm) {
    const FORM_ENDPOINT = "https://formspree.io/f/xkokwgbg";
    const RELEASE_VERSION = 'v2-2026-11';
    const FORM_SUBJECT = 'New Financial Literacy Sign-Up';
    const ERROR_SEND = 'Something went wrong. Please try again or email HugYourHead@Gmail.com.';

    const INDIVIDUAL = 'Individual with Special Needs';
    const PARENT_GUARDIAN = 'Parent or Guardian';
    const SIGNER_SELF = 'Participant (adult, no guardian)';
    const NEEDS_SIGNER_NOTE = ['Teacher or Educator', 'Caregiver or Support Person', 'Other'];

    // Required fields, in the order they appear on the page.
    const FIELD_ORDER = [
      'first_name', 'last_name', 'email', 'signing_up_as',
      'participant_first_name', 'participant_last_name', 'has_guardian',
      'release_agreed', 'signature_name', 'signer_role', 'signature_consent'
    ];

    const roleSelect       = document.getElementById('fl-signing-up-as');
    const participantGroup = document.getElementById('fl-participant-group');
    const guardianGroup    = document.getElementById('fl-guardian-group');
    const signerNote       = document.getElementById('fl-signer-note');
    const releaseBox       = document.getElementById('fl-release-text');
    const statusEl         = document.getElementById('fl-form-status');
    const successEl        = document.getElementById('fl-signup-success');
    const successHeading   = document.getElementById('fl-success-heading');
    const submitBtn        = flForm.querySelector('button[type="submit"]');
    const submitText       = submitBtn ? submitBtn.textContent : '';

    const reduceMotion = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scroll gently, or instantly if the visitor prefers reduced motion.
    // (html has scroll-behavior: smooth, so it is switched off temporarily.)
    const scrollToEl = (el) => {
      if (!el) return;
      if (reduceMotion) {
        const root = document.documentElement;
        const prev = root.style.scrollBehavior;
        root.style.scrollBehavior = 'auto';
        el.scrollIntoView({ block: 'center' });
        root.style.scrollBehavior = prev;
      } else {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    // Local time in ISO 8601 with the real timezone offset, e.g. 2026-11-04T16:36:00-07:00
    const localIsoWithOffset = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      const offsetMin = -d.getTimezoneOffset();
      const sign = offsetMin >= 0 ? '+' : '-';
      const abs = Math.abs(offsetMin);
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) +
        sign + pad(Math.floor(abs / 60)) + ':' + pad(abs % 60);
    };

    // All inputs that share a name (radio groups have more than one).
    const fieldsByName = (name) => Array.from(flForm.querySelectorAll('[name="' + name + '"]'));

    const getValue = (name) => {
      const fields = fieldsByName(name);
      if (!fields.length) return '';
      const first = fields[0];
      if (first.type === 'radio') {
        const checked = fields.find(f => f.checked);
        return checked ? checked.value : '';
      }
      if (first.type === 'checkbox') return first.checked ? first.value : '';
      return (first.value || '').trim();
    };

    const setDescribedBy = (field, id, add) => {
      const ids = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
      const next = add ? (ids.includes(id) ? ids : ids.concat(id)) : ids.filter(x => x !== id);
      if (next.length) field.setAttribute('aria-describedby', next.join(' '));
      else field.removeAttribute('aria-describedby');
    };

    const showError = (name, message) => {
      const err = document.getElementById('fl-err-' + name);
      if (!err) return;
      err.textContent = message;
      err.hidden = false;
      fieldsByName(name).forEach(f => {
        f.setAttribute('aria-invalid', 'true');
        setDescribedBy(f, err.id, true);
      });
    };

    const clearError = (name) => {
      const err = document.getElementById('fl-err-' + name);
      if (!err) return;
      err.textContent = '';
      err.hidden = true;
      fieldsByName(name).forEach(f => {
        f.removeAttribute('aria-invalid');
        setDescribedBy(f, err.id, false);
      });
    };

    const isErrorShown = (name) => {
      const err = document.getElementById('fl-err-' + name);
      return !!(err && !err.hidden);
    };

    // Returns an error message for one field, or '' if it is OK.
    // Hidden (disabled) fields are never validated.
    const validateField = (name) => {
      const fields = fieldsByName(name);
      if (!fields.length || fields[0].disabled) return '';
      const value = getValue(name);

      switch (name) {
        case 'first_name':
          return value ? '' : 'Please type your first name.';
        case 'last_name':
          return value ? '' : 'Please type your last name.';
        case 'email':
          if (!value) return 'Please type your email address.';
          return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
            ? '' : 'This email address does not look right. Please check it. Example: name@example.com';
        case 'signing_up_as':
          return value ? '' : 'Please choose who is signing up.';
        case 'participant_first_name':
          return value ? '' : "Please type the participant's first name.";
        case 'participant_last_name':
          return value ? '' : "Please type the participant's last name.";
        case 'has_guardian':
          return value ? '' : 'Please choose Yes or No.';
        case 'release_agreed':
          return value ? '' : 'You must agree to the Photo & Video Release to sign up.';
        case 'signature_name':
          return value ? '' : 'Please type your full legal name to sign.';
        case 'signer_role': {
          if (!value) return 'Please choose who is signing.';
          const needsGuardian = getValue('has_guardian') === 'Yes' || getValue('signing_up_as') === PARENT_GUARDIAN;
          return (needsGuardian && value === SIGNER_SELF)
            ? 'A parent or legal guardian must sign for this participant.' : '';
        }
        case 'signature_consent':
          return value ? '' : 'Please check this box to agree to your electronic signature.';
        default:
          return '';
      }
    };

    const updateStatus = (count) => {
      statusEl.classList.remove('fl-status--error');
      if (!count) { statusEl.textContent = ''; return; }
      statusEl.classList.add('fl-status--error');
      statusEl.textContent = count === 1
        ? 'There is 1 thing to fix before you can sign up. Please look for the red message.'
        : 'There are ' + count + ' things to fix before you can sign up. Please look for the red messages.';
    };

    // Show or hide a conditional group. Hidden groups are disabled,
    // not required, and emptied, so they are not checked or sent.
    const toggleGroup = (group, show) => {
      if (!group) return;
      group.hidden = !show;
      group.querySelectorAll('input, select, textarea').forEach(f => {
        f.disabled = !show;
        if (show) {
          if (f.dataset.required === 'true') f.required = true;
        } else {
          f.required = false;
          if (f.type === 'radio' || f.type === 'checkbox') f.checked = false;
          else f.value = '';
          if (f.name) clearError(f.name);
        }
      });
    };

    const updateConditionalFields = () => {
      const role = roleSelect ? roleSelect.value : '';
      toggleGroup(participantGroup, role !== '' && role !== INDIVIDUAL);
      toggleGroup(guardianGroup, role === INDIVIDUAL);

      if (signerNote) {
        signerNote.innerHTML = NEEDS_SIGNER_NOTE.includes(role)
          ? '<p class="fl-note">The Photo &amp; Video Release must be signed by the participant (if an adult with no guardian) or by the participant\'s parent or legal guardian. If that isn\'t you, please ask them to sign up, or email <a href="mailto:HugYourHead@Gmail.com">HugYourHead@Gmail.com</a>.</p>'
          : '';
      }
    };

    if (roleSelect) roleSelect.addEventListener('change', updateConditionalFields);
    updateConditionalFields(); // also handles values restored by the browser's Back button

    // Once an error is showing, re-check that field as the visitor fixes it.
    const onFieldChange = (e) => {
      const name = e.target && e.target.name;
      if (!name) return;
      if (FIELD_ORDER.includes(name) && isErrorShown(name)) {
        const msg = validateField(name);
        if (msg) showError(name, msg); else clearError(name);
      }
      // The signer role rule depends on these answers too.
      if ((name === 'signing_up_as' || name === 'has_guardian') && isErrorShown('signer_role')) {
        const msg = validateField('signer_role');
        if (msg) showError('signer_role', msg); else clearError('signer_role');
      }
      if (statusEl.classList.contains('fl-status--error')) {
        updateStatus(FIELD_ORDER.filter(isErrorShown).length);
      }
    };
    flForm.addEventListener('input', onFieldChange);
    flForm.addEventListener('change', onFieldChange);

    let sending = false;

    flForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sending) return;

      // 1. Validate everything
      const errors = [];
      FIELD_ORDER.forEach(name => {
        const msg = validateField(name);
        if (msg) { showError(name, msg); errors.push(name); }
        else clearError(name);
      });
      updateStatus(errors.length);

      if (errors.length) {
        const firstField = fieldsByName(errors[0])[0];
        if (firstField) {
          scrollToEl(firstField);
          firstField.focus({ preventScroll: true });
        }
        return;
      }

      // 2. Fill in the hidden fields at the moment of signing
      const setHidden = (name, value) => {
        const f = flForm.querySelector('input[type="hidden"][name="' + name + '"]');
        if (f) f.value = value;
      };
      setHidden('release_timestamp', localIsoWithOffset(new Date()));
      setHidden('release_version', RELEASE_VERSION);
      setHidden('release_text', releaseBox ? releaseBox.textContent.replace(/\s+/g, ' ').trim() : '');
      setHidden('page_url', window.location.href);
      setHidden('_subject', FORM_SUBJECT);

      // 3. Send
      sending = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      flForm.setAttribute('aria-busy', 'true');

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(flForm),
          headers: { Accept: 'application/json' }
        });
        if (!res.ok) throw new Error('Form service responded with ' + res.status);

        flForm.hidden = true;
        if (successEl) {
          successEl.classList.add('show');
          scrollToEl(successEl);
          if (successHeading) successHeading.focus({ preventScroll: true });
        }
      } catch (err) {
        statusEl.classList.add('fl-status--error');
        statusEl.textContent = ERROR_SEND;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitText;
        }
      } finally {
        sending = false;
        flForm.removeAttribute('aria-busy');
      }
    });
  }

});
