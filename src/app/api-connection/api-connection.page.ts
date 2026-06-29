import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, cloudDownloadOutline, createOutline, trashOutline } from 'ionicons/icons';

import { ApiPost, AppDataService } from '../services/app-data.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-api-connection',
  templateUrl: './api-connection.page.html',
  styleUrls: ['./api-connection.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSpinner,
    IonTextarea,
    IonTitle,
    IonToolbar
  ]
})
export class ApiConnectionPage implements OnInit {
  posts: ApiPost[] = [];
  loading = false;
  statusMessage = '';

  readonly form = this.formBuilder.nonNullable.group({
    id: [''],
    title: ['', [Validators.required]],
    body: ['', [Validators.required]],
    userId: ['1', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
  });

  constructor(
    private readonly apiService: ApiService,
    private readonly appDataService: AppDataService,
    private readonly formBuilder: FormBuilder
  ) {
    addIcons({ addOutline, cloudDownloadOutline, createOutline, trashOutline });
  }

  ngOnInit(): void {
    this.posts = this.appDataService.getApiPosts();
    this.getPosts();
  }

  getPosts(): void {
    this.loading = true;
    this.statusMessage = 'Consultando API JSONPlaceholder...';

    this.apiService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.slice(0, 6);
        this.appDataService.saveApiPosts(this.posts);
        this.statusMessage = 'GET listo: posts cargados y guardados en Storage.';
        this.loading = false;
      },
      error: (error: Error) => {
        this.statusMessage = `No se pudo consultar la API. ${error.message}`;
        this.loading = false;
      }
    });
  }

  selectPost(post: ApiPost): void {
    this.form.setValue({
      id: String(post.id ?? ''),
      title: post.title,
      body: post.body,
      userId: String(post.userId)
    });
  }

  createPost(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const post = this.getFormPost();
    this.loading = true;

    this.apiService.createPost(post).subscribe({
      next: (createdPost) => {
        this.posts = [{ ...createdPost, id: createdPost.id ?? Date.now() }, ...this.posts].slice(0, 6);
        this.appDataService.saveApiPosts(this.posts);
        this.statusMessage = 'POST listo: post creado y persistido.';
        this.loading = false;
      },
      error: (error: Error) => {
        this.statusMessage = `No se pudo crear el post. ${error.message}`;
        this.loading = false;
      }
    });
  }

  updatePost(): void {
    const id = Number(this.form.controls.id.value);

    if (!id || this.form.invalid) {
      this.form.markAllAsTouched();
      this.statusMessage = 'Selecciona un post para modificarlo.';
      return;
    }

    const post = this.getFormPost();
    this.loading = true;

    this.apiService.updatePost(id, post).subscribe({
      next: (updatedPost) => {
        this.posts = this.posts.map((item) => item.id === id ? { ...updatedPost, id } : item);
        this.appDataService.saveApiPosts(this.posts);
        this.statusMessage = 'PUT listo: post modificado y persistido.';
        this.loading = false;
      },
      error: (error: Error) => {
        this.statusMessage = `No se pudo modificar el post. ${error.message}`;
        this.loading = false;
      }
    });
  }

  deletePost(post: ApiPost): void {
    const id = Number(post.id);

    if (!id) {
      return;
    }

    this.loading = true;

    this.apiService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter((item) => item.id !== id);
        this.appDataService.saveApiPosts(this.posts);
        this.statusMessage = 'DELETE listo: post eliminado de la lista persistida.';
        this.loading = false;
      },
      error: (error: Error) => {
        this.statusMessage = `No se pudo eliminar el post. ${error.message}`;
        this.loading = false;
      }
    });
  }

  private getFormPost(): ApiPost {
    const value = this.form.getRawValue();

    return {
      title: value.title,
      body: value.body,
      userId: Number(value.userId)
    };
  }
}
