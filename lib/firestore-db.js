// ============================================
// Firestore Database Module — Lions Diamond Homagama
// Next.js Compatible with Full LocalStorage Sync Persistence
// ============================================

import { db } from './firebase.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment
} from "firebase/firestore";

// =====================
// Toast Notification
// =====================
function showToast(message, type = 'info') {
  if (typeof window === 'undefined') return;
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-circle-check',
    error: 'fa-circle-xmark',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}"></i>
    <p>${message}</p>
    <button class="toast-close"><i class="fa-solid fa-xmark"></i></button>
  `;

  toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// =====================
// SAMPLE INITIAL DATASETS
// =====================
const sampleMembers = [
  { id: 'm-1', name: 'Lion Dr. Samarasekara', role: 'President', email: 'president@lionsclubhomagamadiamonds.org', phone: '+94 77 123 4567', status: 'Active', joinedDate: new Date('2022-01-15').toISOString() },
  { id: 'm-2', name: 'Lion Chaminda Perera', role: 'Secretary', email: 'secretary@lionsclubhomagamadiamonds.org', phone: '+94 71 987 6543', status: 'Active', joinedDate: new Date('2022-03-20').toISOString() },
  { id: 'm-3', name: 'Lion Kanthi Silva', role: 'Treasurer', email: 'treasurer@lionsclubhomagamadiamonds.org', phone: '+94 76 555 1234', status: 'Active', joinedDate: new Date('2022-05-10').toISOString() }
];

const sampleEvents = [
  { id: 'e-1', title: 'Free Medical & Vision Care Camp 2025', category: 'Health', status: 'Upcoming', location: 'Homagama Central College', date: new Date('2025-04-15').toISOString(), budget: 250000, description: 'Comprehensive free eye clinic, prescription glass distribution, and general health checkup for low-income families.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80' },
  { id: 'e-2', title: 'Community Library Book & Lab Equipment Drive', category: 'Education', status: 'Completed', location: 'Homagama Primary School', date: new Date('2025-01-10').toISOString(), budget: 180000, description: 'Donated 1,000+ textbooks, science lab instruments, and computers to school library.', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80' }
];

const sampleGallery = [
  { id: 'g-1', title: 'Medical Camp Eye Examination', category: 'Health', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', uploadedAt: new Date().toISOString() },
  { id: 'g-2', title: 'Student Book Distribution', category: 'Education', imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80', uploadedAt: new Date().toISOString() }
];

const sampleDonations = [
  { id: 'd-1', donorName: 'Saman Jayasinghe', email: 'saman@example.com', amount: 25000, cause: 'Health Care', status: 'verified', submittedAt: new Date().toISOString(), slipUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&q=80' },
  { id: 'd-2', donorName: 'Nimali Fernando', email: 'nimali@example.com', amount: 15000, cause: 'Education', status: 'pending', submittedAt: new Date().toISOString(), slipUrl: '' }
];

const sampleJoinRequests = [
  { id: 'j-1', fullName: 'Sunil Wickramasinghe', email: 'sunil@example.com', phone: '+94 77 333 4444', occupation: 'Civil Engineer', motivation: 'Eager to serve the Homagama community.', status: 'pending', submittedAt: new Date().toISOString() }
];

// =====================
// MEMBERS COLLECTION
// =====================
async function getMembers() {
  try {
    const q = query(collection(db, 'members'), orderBy('joinedDate', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_members', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_members');
      if (local !== null) return JSON.parse(local);
      localStorage.setItem('lions_members', JSON.stringify(sampleMembers));
    }
    return sampleMembers;
  } catch (error) {
    console.error('Error fetching members:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_members');
      if (local !== null) return JSON.parse(local);
    }
    return sampleMembers;
  }
}

function clearAllMembers() {
  if (typeof window !== 'undefined') {
    localStorage.setItem('lions_members', JSON.stringify([]));
    showToast('Members list cleared.', 'info');
  }
  return [];
}

function bulkAddMembers(newMembers) {
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem('lions_members') || '[]');
    const updated = [...newMembers, ...existing];
    localStorage.setItem('lions_members', JSON.stringify(updated));
    showToast(`Added ${newMembers.length} members successfully!`, 'success');
    return updated;
  }
  return newMembers;
}

async function addMember(data) {
  const dateStr = data.joinedDate || new Date().toISOString();
  try {
    data.joinedDate = serverTimestamp();
    const docRef = await addDoc(collection(db, 'members'), data);
    showToast('Member added successfully!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_members') || JSON.stringify(sampleMembers));
      local.unshift({ id: docRef.id, ...data, joinedDate: dateStr });
      localStorage.setItem('lions_members', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore addMember fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_members') || JSON.stringify(sampleMembers));
      const newItem = { id: 'm-' + Date.now(), ...data, joinedDate: dateStr };
      local.unshift(newItem);
      localStorage.setItem('lions_members', JSON.stringify(local));
      showToast('Member added successfully!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function updateMember(id, data) {
  try {
    await updateDoc(doc(db, 'members', id), data);
    showToast('Member updated successfully!', 'success');
  } catch (error) {
    console.warn('Firestore updateMember fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_members') || '[]');
    const updated = local.map(m => m.id === id ? { ...m, ...data } : m);
    localStorage.setItem('lions_members', JSON.stringify(updated));
    showToast('Member updated successfully!', 'success');
  }
}

async function deleteMember(id) {
  try {
    await deleteDoc(doc(db, 'members', id));
  } catch (error) {
    console.warn('Firestore deleteMember fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_members') || '[]');
    const filtered = local.filter(m => m.id !== id);
    localStorage.setItem('lions_members', JSON.stringify(filtered));
    showToast('Member removed.', 'success');
  }
}

// =====================
// EVENTS COLLECTION
// =====================
async function getEvents(statusFilter = null) {
  try {
    let q = statusFilter ? query(collection(db, 'events'), where('status', '==', statusFilter), orderBy('date', 'desc'))
      : query(collection(db, 'events'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_events', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_events');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(e => e.status === statusFilter) : parsed;
      }
      localStorage.setItem('lions_events', JSON.stringify(sampleEvents));
    }
    return statusFilter ? sampleEvents.filter(e => e.status === statusFilter) : sampleEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_events');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(e => e.status === statusFilter) : parsed;
      }
    }
    return statusFilter ? sampleEvents.filter(e => e.status === statusFilter) : sampleEvents;
  }
}

async function addEvent(data) {
  const eventDate = data.date || new Date().toISOString();
  try {
    if (data.date) data.date = Timestamp.fromDate(new Date(data.date));
    const docRef = await addDoc(collection(db, 'events'), data);
    showToast('Event added!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_events') || JSON.stringify(sampleEvents));
      local.unshift({ id: docRef.id, ...data, date: eventDate });
      localStorage.setItem('lions_events', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore addEvent fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_events') || JSON.stringify(sampleEvents));
      const newItem = { id: 'e-' + Date.now(), ...data, date: eventDate };
      local.unshift(newItem);
      localStorage.setItem('lions_events', JSON.stringify(local));
      showToast('Event added!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function updateEvent(id, data) {
  try {
    const updateData = { ...data };
    if (updateData.date) updateData.date = Timestamp.fromDate(new Date(updateData.date));
    await updateDoc(doc(db, 'events', id), updateData);
  } catch (error) {
    console.warn('Firestore updateEvent fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_events') || '[]');
    const updated = local.map(e => e.id === id ? { ...e, ...data } : e);
    localStorage.setItem('lions_events', JSON.stringify(updated));
    showToast('Event updated!', 'success');
  }
}

async function deleteEvent(id) {
  try {
    await deleteDoc(doc(db, 'events', id));
  } catch (error) {
    console.warn('Firestore deleteEvent fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_events') || '[]');
    const filtered = local.filter(e => e.id !== id);
    localStorage.setItem('lions_events', JSON.stringify(filtered));
    showToast('Event deleted.', 'success');
  }
}

// =====================
// GALLERY COLLECTION
// =====================
async function getGalleryImages(category = null) {
  try {
    let q = (category && category !== 'All') ? query(collection(db, 'gallery'), where('category', '==', category), orderBy('uploadedAt', 'desc'))
      : query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_gallery', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_gallery');
      if (local) {
        const parsed = JSON.parse(local);
        return (category && category !== 'All') ? parsed.filter(g => g.category === category) : parsed;
      }
      localStorage.setItem('lions_gallery', JSON.stringify(sampleGallery));
    }
    return (category && category !== 'All') ? sampleGallery.filter(g => g.category === category) : sampleGallery;
  } catch (error) {
    console.error('Error fetching gallery:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_gallery');
      if (local) {
        const parsed = JSON.parse(local);
        return (category && category !== 'All') ? parsed.filter(g => g.category === category) : parsed;
      }
    }
    return (category && category !== 'All') ? sampleGallery.filter(g => g.category === category) : sampleGallery;
  }
}

async function addGalleryImage(data) {
  const uploadDate = new Date().toISOString();
  try {
    data.uploadedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'gallery'), data);
    showToast('Image added to gallery!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_gallery') || JSON.stringify(sampleGallery));
      local.unshift({ id: docRef.id, ...data, uploadedAt: uploadDate });
      localStorage.setItem('lions_gallery', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore addGalleryImage fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_gallery') || JSON.stringify(sampleGallery));
      const newItem = { id: 'g-' + Date.now(), ...data, uploadedAt: uploadDate };
      local.unshift(newItem);
      localStorage.setItem('lions_gallery', JSON.stringify(local));
      showToast('Image added to gallery!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function deleteGalleryImage(id) {
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    console.warn('Firestore deleteGalleryImage fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_gallery') || '[]');
    const filtered = local.filter(g => g.id !== id);
    localStorage.setItem('lions_gallery', JSON.stringify(filtered));
    showToast('Image removed from gallery.', 'success');
  }
}

// =====================
// JOIN REQUESTS COLLECTION
// =====================
async function getJoinRequests(statusFilter = null) {
  try {
    let q = statusFilter ? query(collection(db, 'joinRequests'), where('status', '==', statusFilter), orderBy('submittedAt', 'desc'))
      : query(collection(db, 'joinRequests'), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_join_requests', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_join_requests');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(j => j.status === statusFilter) : parsed;
      }
      localStorage.setItem('lions_join_requests', JSON.stringify(sampleJoinRequests));
    }
    return statusFilter ? sampleJoinRequests.filter(j => j.status === statusFilter) : sampleJoinRequests;
  } catch (error) {
    console.error('Error fetching join requests:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_join_requests');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(j => j.status === statusFilter) : parsed;
      }
    }
    return statusFilter ? sampleJoinRequests.filter(j => j.status === statusFilter) : sampleJoinRequests;
  }
}

async function submitJoinRequest(data) {
  const submitDate = new Date().toISOString();
  try {
    data.status = 'pending';
    data.submittedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'joinRequests'), data);
    showToast('Application submitted successfully!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_join_requests') || JSON.stringify(sampleJoinRequests));
      local.unshift({ id: docRef.id, ...data, submittedAt: submitDate });
      localStorage.setItem('lions_join_requests', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore submitJoinRequest fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_join_requests') || JSON.stringify(sampleJoinRequests));
      const newItem = { id: 'j-' + Date.now(), ...data, status: 'pending', submittedAt: submitDate };
      local.unshift(newItem);
      localStorage.setItem('lions_join_requests', JSON.stringify(local));
      showToast('Application submitted successfully!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function updateJoinRequestStatus(id, status) {
  try {
    await updateDoc(doc(db, 'joinRequests', id), { status });
  } catch (error) {
    console.warn('Firestore updateJoinRequestStatus fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_join_requests') || '[]');
    const updated = local.map(j => j.id === id ? { ...j, status } : j);
    localStorage.setItem('lions_join_requests', JSON.stringify(updated));
    showToast(`Request ${status}!`, 'success');
  }
}

async function deleteJoinRequest(id) {
  try {
    await deleteDoc(doc(db, 'joinRequests', id));
  } catch (error) {
    console.warn('Firestore deleteJoinRequest fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_join_requests') || '[]');
    const filtered = local.filter(j => j.id !== id);
    localStorage.setItem('lions_join_requests', JSON.stringify(filtered));
    showToast('Request deleted successfully.', 'success');
  }
}

// =====================
// DONATIONS COLLECTION
// =====================
async function getDonations(statusFilter = null) {
  try {
    let q = statusFilter ? query(collection(db, 'donations'), where('status', '==', statusFilter), orderBy('submittedAt', 'desc'))
      : query(collection(db, 'donations'), orderBy('submittedAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_donations', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_donations');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(d => d.status === statusFilter) : parsed;
      }
      localStorage.setItem('lions_donations', JSON.stringify(sampleDonations));
    }
    return statusFilter ? sampleDonations.filter(d => d.status === statusFilter) : sampleDonations;
  } catch (error) {
    console.error('Error fetching donations:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_donations');
      if (local) {
        const parsed = JSON.parse(local);
        return statusFilter ? parsed.filter(d => d.status === statusFilter) : parsed;
      }
    }
    return statusFilter ? sampleDonations.filter(d => d.status === statusFilter) : sampleDonations;
  }
}

async function submitDonation(data) {
  const submitDate = new Date().toISOString();
  try {
    data.status = 'pending';
    data.amount = parseFloat(data.amount);
    data.submittedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'donations'), data);
    showToast('Donation recorded successfully!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_donations') || JSON.stringify(sampleDonations));
      local.unshift({ id: docRef.id, ...data, submittedAt: submitDate });
      localStorage.setItem('lions_donations', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore submitDonation fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_donations') || JSON.stringify(sampleDonations));
      const newItem = { id: 'd-' + Date.now(), ...data, amount: parseFloat(data.amount), status: 'pending', submittedAt: submitDate };
      local.unshift(newItem);
      localStorage.setItem('lions_donations', JSON.stringify(local));
      showToast('Donation recorded successfully!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function updateDonationStatus(id, status) {
  try {
    await updateDoc(doc(db, 'donations', id), { status });
  } catch (error) {
    console.warn('Firestore updateDonationStatus fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_donations') || '[]');
    const updated = local.map(d => d.id === id ? { ...d, status } : d);
    localStorage.setItem('lions_donations', JSON.stringify(updated));
    showToast(`Donation marked as ${status}!`, 'success');
  }
}

async function deleteDonation(id) {
  try {
    await deleteDoc(doc(db, 'donations', id));
  } catch (error) {
    console.warn('Firestore deleteDonation fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_donations') || '[]');
    const filtered = local.filter(d => d.id !== id);
    localStorage.setItem('lions_donations', JSON.stringify(filtered));
    showToast('Donation deleted successfully.', 'success');
  }
}

// =====================
// SETTINGS COLLECTION
// =====================
async function getSettings() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'main'));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (typeof window !== 'undefined') {
        localStorage.setItem('lions_settings', JSON.stringify(data));
      }
      return data;
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('lions_settings');
    if (local) return JSON.parse(local);
  }
  return { activeFestival: 'none', festivalGreeting: '' };
}

async function updateSettings(data) {
  try {
    const docRef = doc(db, 'settings', 'main');
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, data);
    } else {
      await setDoc(docRef, data, { merge: true });
    }
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('lions_settings') || '{}');
      const updated = { ...current, ...data };
      localStorage.setItem('lions_settings', JSON.stringify(updated));
      window.dispatchEvent(new Event('lions_settings_changed'));
    }
    showToast('Settings updated successfully!', 'success');
  } catch (error) {
    console.warn('Firestore updateSettings fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const current = JSON.parse(localStorage.getItem('lions_settings') || '{}');
      const updated = { ...current, ...data };
      localStorage.setItem('lions_settings', JSON.stringify(updated));
      window.dispatchEvent(new Event('lions_settings_changed'));
      showToast('Settings updated!', 'success');
    }
  }
}

// =====================
// UTILITY: Collection Count
// =====================
async function getCollectionCount(collectionName, statusField = null, statusValue = null) {
  try {
    let q = (statusField && statusValue) ? query(collection(db, collectionName), where(statusField, '==', statusValue))
      : collection(db, collectionName);
    const snapshot = await getDocs(q);
    if (snapshot.size > 0) return snapshot.size;
  } catch (error) {
    console.error(`Error counting ${collectionName}:`, error);
  }
  if (typeof window !== 'undefined') {
    const keyMap = {
      members: 'lions_members',
      events: 'lions_events',
      gallery: 'lions_gallery',
      donations: 'lions_donations',
      joinRequests: 'lions_join_requests',
      shortVideos: 'lions_short_videos',
      projectDocuments: 'lions_project_docs'
    };
    const localKey = keyMap[collectionName];
    if (localKey) {
      const local = JSON.parse(localStorage.getItem(localKey) || '[]');
      if (statusField && statusValue) {
        return local.filter(item => item[statusField] === statusValue).length;
      }
      return local.length;
    }
  }
  return 0;
}

// =====================
// UTILITY: Format Timestamp
// =====================
function formatDate(timestamp) {
  if (!timestamp) return '—';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// =====================
// UTILITY: Format Currency
// =====================
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0
  }).format(amount);
}

// =====================
// GALLERY CATEGORIES
// =====================
async function getGalleryCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'galleryCategories'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
    if (list.length > 0) return list;
  } catch (error) {
    console.error('Error fetching gallery categories:', error);
  }
  return [
    { id: 'cat-1', name: 'Service' },
    { id: 'cat-2', name: 'Education' },
    { id: 'cat-3', name: 'Health' },
    { id: 'cat-4', name: 'Donations' },
    { id: 'cat-5', name: 'Meetings' }
  ];
}

async function addGalleryCategory(name) {
  try {
    const docRef = await addDoc(collection(db, 'galleryCategories'), { name });
    showToast('Category added successfully!', 'success');
    return { id: docRef.id, name };
  } catch (error) {
    showToast('Failed to add category.', 'error');
    console.error(error);
    return null;
  }
}

async function deleteGalleryCategory(id) {
  try {
    await deleteDoc(doc(db, 'galleryCategories', id));
    showToast('Category removed.', 'success');
    return true;
  } catch (error) {
    showToast('Failed to delete category.', 'error');
    console.error(error);
    return false;
  }
}

// =====================
// UTILITY: Track/Increment View Count
// =====================
async function incrementViewCount(pathname) {
  if (typeof window === 'undefined') return;
  try {
    let pageKey = 'home';
    if (pathname && pathname !== '/') {
      pageKey = pathname.replace(/^\//, '').split('/')[0];
    }
    if (!pageKey) pageKey = 'home';

    const docRef = doc(db, 'settings', 'main');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        viewsCount: 1,
        pageViews: {
          [pageKey]: 1
        }
      });
    } else {
      await updateDoc(docRef, {
        viewsCount: increment(1),
        [`pageViews.${pageKey}`]: increment(1)
      });
    }
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

// =====================
// SHORT VIDEOS COLLECTION
// =====================
const sampleShortVideos = [
  {
    id: 'sv-1',
    title: 'Health Camp & Free Eye Screening Highlights',
    description: 'Highlights from our medical outreach program serving 300+ residents in Homagama.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Health',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sv-2',
    title: 'School Supplies & Book Donation Drive',
    description: 'Empowering children with essential learning materials for the new school year.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Education',
    createdAt: new Date().toISOString()
  },
  {
    id: 'sv-3',
    title: 'Blood Donation & Youth Service Highlights',
    description: 'Blood donation camp in collaboration with National Blood Transfusion Service.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    category: 'Community',
    createdAt: new Date().toISOString()
  }
];

async function getShortVideos() {
  try {
    const q = query(collection(db, 'shortVideos'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_short_videos', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_short_videos');
      if (local) return JSON.parse(local);
      localStorage.setItem('lions_short_videos', JSON.stringify(sampleShortVideos));
    }
    return sampleShortVideos;
  } catch (error) {
    console.error('Error fetching short videos:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_short_videos');
      if (local) return JSON.parse(local);
    }
    return sampleShortVideos;
  }
}

async function addShortVideo(data) {
  const createdDate = new Date().toISOString();
  try {
    data.createdAt = createdDate;
    const docRef = await addDoc(collection(db, 'shortVideos'), data);
    showToast('Short video added successfully!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_short_videos') || JSON.stringify(sampleShortVideos));
      local.unshift({ id: docRef.id, ...data, createdAt: createdDate });
      localStorage.setItem('lions_short_videos', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore addShortVideo fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_short_videos') || JSON.stringify(sampleShortVideos));
      const newItem = { id: 'sv-' + Date.now(), ...data, createdAt: createdDate };
      local.unshift(newItem);
      localStorage.setItem('lions_short_videos', JSON.stringify(local));
      showToast('Short video added successfully!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function deleteShortVideo(id) {
  try {
    await deleteDoc(doc(db, 'shortVideos', id));
  } catch (error) {
    console.warn('Firestore deleteShortVideo fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_short_videos') || '[]');
    const filtered = local.filter(v => v.id !== id);
    localStorage.setItem('lions_short_videos', JSON.stringify(filtered));
    showToast('Short video deleted.', 'success');
  }
}

// =====================
// PROJECT DOCUMENTS COLLECTION
// =====================
const sampleProjectDocuments = [
  {
    id: 'doc-1',
    title: 'Annual Community Health Camp Report 2025',
    description: 'Detailed report covering patient demographics, medical supplies distributed, and health outcomes.',
    projectTitle: 'Health Camp 2025',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Health_Camp_Report_2025.pdf',
    uploadedAt: new Date().toISOString()
  },
  {
    id: 'doc-2',
    title: 'Homagama Youth Education Initiative Plan',
    description: 'Proposal and resource distribution roadmap for primary school educational sponsorship.',
    projectTitle: 'Education Drive',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileName: 'Youth_Education_Plan.pdf',
    uploadedAt: new Date().toISOString()
  }
];

async function getProjectDocuments() {
  try {
    const q = query(collection(db, 'projectDocuments'), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    if (docs.length > 0) {
      if (typeof window !== 'undefined') localStorage.setItem('lions_project_docs', JSON.stringify(docs));
      return docs;
    }
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_project_docs');
      if (local) return JSON.parse(local);
      localStorage.setItem('lions_project_docs', JSON.stringify(sampleProjectDocuments));
    }
    return sampleProjectDocuments;
  } catch (error) {
    console.error('Error fetching project documents:', error);
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('lions_project_docs');
      if (local) return JSON.parse(local);
    }
    return sampleProjectDocuments;
  }
}

async function addProjectDocument(data) {
  const uploadDate = new Date().toISOString();
  try {
    data.uploadedAt = uploadDate;
    const docRef = await addDoc(collection(db, 'projectDocuments'), data);
    showToast('Project document added successfully!', 'success');
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_project_docs') || JSON.stringify(sampleProjectDocuments));
      local.unshift({ id: docRef.id, ...data, uploadedAt: uploadDate });
      localStorage.setItem('lions_project_docs', JSON.stringify(local));
    }
    return docRef.id;
  } catch (error) {
    console.warn('Firestore addProjectDocument fallback to localStorage:', error);
    if (typeof window !== 'undefined') {
      const local = JSON.parse(localStorage.getItem('lions_project_docs') || JSON.stringify(sampleProjectDocuments));
      const newItem = { id: 'doc-' + Date.now(), ...data, uploadedAt: uploadDate };
      local.unshift(newItem);
      localStorage.setItem('lions_project_docs', JSON.stringify(local));
      showToast('Project document added successfully!', 'success');
      return newItem.id;
    }
    return null;
  }
}

async function deleteProjectDocument(id) {
  try {
    await deleteDoc(doc(db, 'projectDocuments', id));
  } catch (error) {
    console.warn('Firestore deleteProjectDocument fallback to localStorage:', error);
  }
  if (typeof window !== 'undefined') {
    const local = JSON.parse(localStorage.getItem('lions_project_docs') || '[]');
    const filtered = local.filter(d => d.id !== id);
    localStorage.setItem('lions_project_docs', JSON.stringify(filtered));
    showToast('Project document deleted.', 'success');
  }
}

export {
  showToast,
  getMembers, addMember, updateMember, deleteMember, clearAllMembers, bulkAddMembers,
  getEvents, addEvent, updateEvent, deleteEvent,
  getGalleryImages, addGalleryImage, deleteGalleryImage,
  getGalleryCategories, addGalleryCategory, deleteGalleryCategory,
  getJoinRequests, submitJoinRequest, updateJoinRequestStatus, deleteJoinRequest,
  getDonations, submitDonation, updateDonationStatus, deleteDonation,
  getSettings, updateSettings,
  getCollectionCount, formatDate, formatCurrency,
  incrementViewCount,
  getShortVideos, addShortVideo, deleteShortVideo,
  getProjectDocuments, addProjectDocument, deleteProjectDocument
};
