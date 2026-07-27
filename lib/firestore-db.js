// ============================================
// Firestore Database Module — Lions Diamond Homagama
// Next.js Compatible
// ============================================

import { db } from './firebase.js';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp
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
// MEMBERS COLLECTION
// =====================
async function getMembers() {
  try {
    const q = query(collection(db, 'members'), orderBy('joinedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching members:', error);
    return [];
  }
}

async function addMember(data) {
  try {
    data.joinedDate = serverTimestamp();
    const docRef = await addDoc(collection(db, 'members'), data);
    showToast('Member added successfully!', 'success');
    return docRef.id;
  } catch (error) {
    showToast('Failed to add member.', 'error');
    console.error(error);
    return null;
  }
}

async function updateMember(id, data) {
  try {
    await updateDoc(doc(db, 'members', id), data);
    showToast('Member updated successfully!', 'success');
  } catch (error) {
    showToast('Failed to update member.', 'error');
    console.error(error);
  }
}

async function deleteMember(id) {
  try {
    await deleteDoc(doc(db, 'members', id));
    showToast('Member removed.', 'success');
  } catch (error) {
    showToast('Failed to delete member.', 'error');
    console.error(error);
  }
}

// =====================
// EVENTS COLLECTION
// =====================
async function getEvents(statusFilter = null) {
  try {
    let q;
    if (statusFilter) {
      q = query(collection(db, 'events'), where('status', '==', statusFilter), orderBy('date', 'desc'));
    } else {
      q = query(collection(db, 'events'), orderBy('date', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
}

async function addEvent(data) {
  try {
    if (data.date) data.date = Timestamp.fromDate(new Date(data.date));
    const docRef = await addDoc(collection(db, 'events'), data);
    showToast('Event added!', 'success');
    return docRef.id;
  } catch (error) {
    showToast('Failed to add event.', 'error');
    console.error(error);
    return null;
  }
}

async function updateEvent(id, data) {
  try {
    if (data.date) data.date = Timestamp.fromDate(new Date(data.date));
    await updateDoc(doc(db, 'events', id), data);
    showToast('Event updated!', 'success');
  } catch (error) {
    showToast('Failed to update event.', 'error');
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    await deleteDoc(doc(db, 'events', id));
    showToast('Event deleted.', 'success');
  } catch (error) {
    showToast('Failed to delete event.', 'error');
    console.error(error);
  }
}

// =====================
// GALLERY COLLECTION
// =====================
async function getGalleryImages(category = null) {
  try {
    let q;
    if (category && category !== 'All') {
      q = query(collection(db, 'gallery'), where('category', '==', category), orderBy('uploadedAt', 'desc'));
    } else {
      q = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return [];
  }
}

async function addGalleryImage(data) {
  try {
    data.uploadedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'gallery'), data);
    showToast('Image added to gallery!', 'success');
    return docRef.id;
  } catch (error) {
    showToast('Failed to add image.', 'error');
    console.error(error);
    return null;
  }
}

async function deleteGalleryImage(id) {
  try {
    await deleteDoc(doc(db, 'gallery', id));
    showToast('Image removed from gallery.', 'success');
  } catch (error) {
    showToast('Failed to delete image.', 'error');
    console.error(error);
  }
}

// =====================
// JOIN REQUESTS COLLECTION
// =====================
async function getJoinRequests(statusFilter = null) {
  try {
    let q;
    if (statusFilter) {
      q = query(collection(db, 'joinRequests'), where('status', '==', statusFilter), orderBy('submittedAt', 'desc'));
    } else {
      q = query(collection(db, 'joinRequests'), orderBy('submittedAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching join requests:', error);
    return [];
  }
}

async function submitJoinRequest(data) {
  try {
    data.status = 'pending';
    data.submittedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'joinRequests'), data);
    showToast('Application submitted successfully!', 'success');
    return docRef.id;
  } catch (error) {
    showToast('Failed to submit application.', 'error');
    console.error(error);
    return null;
  }
}

async function updateJoinRequestStatus(id, status) {
  try {
    await updateDoc(doc(db, 'joinRequests', id), { status });
    showToast(`Request ${status}!`, 'success');
  } catch (error) {
    showToast('Failed to update request.', 'error');
    console.error(error);
  }
}

async function deleteJoinRequest(id) {
  try {
    await deleteDoc(doc(db, 'joinRequests', id));
    showToast('Request deleted successfully.', 'success');
  } catch (error) {
    showToast('Failed to delete request.', 'error');
    console.error(error);
  }
}

// =====================
// DONATIONS COLLECTION
// =====================
async function getDonations(statusFilter = null) {
  try {
    let q;
    if (statusFilter) {
      q = query(collection(db, 'donations'), where('status', '==', statusFilter), orderBy('submittedAt', 'desc'));
    } else {
      q = query(collection(db, 'donations'), orderBy('submittedAt', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching donations:', error);
    return [];
  }
}

async function submitDonation(data) {
  try {
    data.status = 'pending';
    data.amount = parseFloat(data.amount);
    data.submittedAt = serverTimestamp();
    const docRef = await addDoc(collection(db, 'donations'), data);
    showToast('Donation recorded successfully!', 'success');
    return docRef.id;
  } catch (error) {
    showToast('Failed to submit donation.', 'error');
    console.error(error);
    return null;
  }
}

async function updateDonationStatus(id, status) {
  try {
    await updateDoc(doc(db, 'donations', id), { status });
    showToast(`Donation marked as ${status}!`, 'success');
  } catch (error) {
    showToast('Failed to update donation.', 'error');
    console.error(error);
  }
}

// =====================
// SETTINGS COLLECTION
// =====================
async function getSettings() {
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'main'));
    if (docSnap.exists()) return docSnap.data();
    return null;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

async function updateSettings(data) {
  try {
    await updateDoc(doc(db, 'settings', 'main'), data);
    showToast('Settings updated!', 'success');
  } catch (error) {
    showToast('Failed to update settings.', 'error');
    console.error(error);
  }
}

// =====================
// UTILITY: Collection Count
// =====================
async function getCollectionCount(collectionName, statusField = null, statusValue = null) {
  try {
    let q;
    if (statusField && statusValue) {
      q = query(collection(db, collectionName), where(statusField, '==', statusValue));
    } else {
      q = collection(db, collectionName);
    }
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error(`Error counting ${collectionName}:`, error);
    return 0;
  }
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

export {
  showToast,
  getMembers, addMember, updateMember, deleteMember,
  getEvents, addEvent, updateEvent, deleteEvent,
  getGalleryImages, addGalleryImage, deleteGalleryImage,
  getJoinRequests, submitJoinRequest, updateJoinRequestStatus, deleteJoinRequest,
  getDonations, submitDonation, updateDonationStatus,
  getSettings, updateSettings,
  getCollectionCount, formatDate, formatCurrency
};
