import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MedicamentService } from '../../../services/medicament.service';
import { medicament } from '../../../model/medicament.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-lister-medicament',
  templateUrl: './lister-medicament.component.html',
  styleUrls: ['./lister-medicament.component.css']
})
export class ListerMedicamentComponent implements OnInit {
  medicaments!: medicament[];
  role!: string;

  constructor(private router: Router, private medicamentService: MedicamentService , private authService: AuthService) {}

  ngOnInit(): void {
    this.medicaments = this.medicamentService.listerMedicament();
    this.role = this.authService.getRole(); 
  }

  supprimerMedicament(m: medicament) {
    let conf = confirm("Vous êtes sûr ?");
    if (conf) {
      this.medicamentService.supprimerMedicament(m);
      this.medicaments = this.medicamentService.listerMedicament(); // Met à jour la liste après suppression
    }
  }

  modifierMedicament(id: number) {
    this.router.navigate(['/admin-dashboard/medicament/modifierMedicament', id]);
  }
}
